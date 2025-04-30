# backend/app/utils/ai.py

import os
import re
import json
import asyncio
from datetime import datetime
from typing import Any, Dict, List
from pathlib import Path

import requests
import yfinance as yf
from openai import AsyncOpenAI

aclient = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
from dotenv import load_dotenv

# ─────────────────────────────────────────────────────────────────────────────
# 1) Load all your env vars from backend/.env
# ─────────────────────────────────────────────────────────────────────────────
BASE = Path(__file__).parent.parent  # => backend/
load_dotenv(BASE / ".env")

MODEL            = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
ALPHA_KEY        = os.getenv("ALPHA_VANTAGE_KEY", "").strip()

AV_URL = "https://www.alphavantage.co/query"


async def fetch_live_prices(tickers: List[str]) -> Dict[str, float]:
    if ALPHA_KEY:
        def _av_fetch():
            prices: Dict[str, float] = {}
            for sym in tickers:
                resp = requests.get(AV_URL, params={
                    "function": "GLOBAL_QUOTE",
                    "symbol":   sym,
                    "apikey":   ALPHA_KEY,
                }, timeout=10)
                data = resp.json().get("Global Quote", {})
                prices[sym] = float(data.get("05. price", 0) or 0)
            return prices
        return await asyncio.to_thread(_av_fetch)

    # fallback to yfinance
    def _yf_fetch():
        data = yf.download(tickers, period="1d", interval="1d", progress=False)
        close = data["Close"]
        if isinstance(close, float):
            return {tickers[0]: close}
        return {sym: float(close[sym].iloc[-1]) for sym in tickers}

    return await asyncio.to_thread(_yf_fetch)


async def get_portfolio(profile: Dict[str, Any]) -> Dict[str, Any]:
    # ─────────────────────────────────────────────────────────────────────────
    # 2) Build a system + user prompt so GPT only emits JSON
    # ─────────────────────────────────────────────────────────────────────────
    system_msg = {
        "role": "system",
        "content": (
            "You are an expert financial advisor.  "
            "Respond *only* with a single JSON object, containing a top-level key "
            "`holdings`, whose value is a list of { ticker: string, allocation: number }."
        )
    }
    user_msg = {
        "role": "user",
        "content": json.dumps({
            "budget":      profile["budget"],
            "horizon":     profile["horizon"],
            "risk":        profile["risk"],
            "preferences": profile.get("preferences", []),
            "broker":      profile.get("broker")
        })
    }

    resp = await aclient.chat.completions.create(model=MODEL,
    messages=[system_msg, user_msg],
    temperature=0.0,
    max_tokens=512)
    raw = resp.choices[0].message.content

    # ─────────────────────────────────────────────────────────────────────────
    # 3) Strip fences & extract the first {...} block
    # ─────────────────────────────────────────────────────────────────────────
    # e.g. remove ```json ... ``` or any leading text
    txt = raw.strip()
    # if they wrapped in markdown fences, drop them
    if txt.startswith("```"):
        txt = txt.strip("`").strip()
    # now find the first JSON object
    m = re.search(r"\{.*\}", txt, re.DOTALL)
    if not m:
        raise ValueError(f"Could not find JSON in LLM reply:\n{raw!r}")
    json_str = m.group(0)

    # ─────────────────────────────────────────────────────────────────────────
    # 4) Parse it
    # ─────────────────────────────────────────────────────────────────────────
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"LLM returned invalid JSON ({e}):\n{json_str!r}")

    holdings = data.get("holdings", [])
    tickers  = [h["ticker"] for h in holdings if "ticker" in h]

    # ─────────────────────────────────────────────────────────────────────────
    # 5) Fetch live prices & attach
    # ─────────────────────────────────────────────────────────────────────────
    prices = await fetch_live_prices(tickers)
    for h in holdings:
        h["price"] = prices.get(h["ticker"], 0.0)

    return {
        "holdings":     holdings,
        "generated_at": datetime.utcnow().isoformat() + "Z",
    }