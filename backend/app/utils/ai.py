import json, openai, asyncio
from ..core.config import settings

if not settings().OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set – obtain it from https://platform.openai.com")

openai.api_key = settings().OPENAI_API_KEY

SYSTEM = (
  "You are AIIA, a professional US-markets investment adviser.\n"
  "Return ONLY a JSON array.  Each element must have:\n"
  "ticker, asset_type, allocation_percent (integer 1-100), reason.\n"
  "Make sure totals == 100."
)

async def get_portfolio(pref: dict) -> list[dict]:
    user_prompt = (
        f"Budget: ${pref['budget']}\n"
        f"Time horizon (years): {pref['horizon']}\n"
        f"Risk tolerance: {pref['risk']}\n"
        f"Asset prefs: {', '.join(pref['preferences'])}\n"
        f"Broker choice: {pref['broker']}\n"
        "Provide recommendation."
    )
    rsp = await openai.ChatCompletion.acreate(
        model=settings().OPENAI_MODEL,
        messages=[{"role":"system","content":SYSTEM},{"role":"user","content":user_prompt}],
        temperature=0.2
    )
    txt = rsp.choices[0].message.content.strip()
    return json.loads(txt)