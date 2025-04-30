from fastapi import APIRouter, Depends
from ..utils.ai import get_portfolio
from ..utils.auth import get_current_user
from ..database import db
from pydantic import BaseModel, PositiveInt, conlist
from datetime import datetime

class HoldingIn(BaseModel):
    ticker: str
    allocation: int

class RecRequest(BaseModel):
    budget: PositiveInt
    horizon: PositiveInt
    risk: str  # validated client‑side
    preferences: conlist(str, min_items=1)
    broker: str | None = None

router = APIRouter(prefix="/recommend", tags=["recommend"])

@router.post("", status_code=200)
async def recommend(body: RecRequest, user = Depends(get_current_user)):
    profile = user.get("preferences", {}) | body.dict()
    rec_data = await get_portfolio(profile)

    rec_data["user_id"] = user["_id"]
    await db.recommendations.insert_one(rec_data)
    return rec_data

@router.get("", status_code=200)
async def history(user=Depends(get_current_user)):
    docs = db.recommend.find({"user_id": user["_id"]}).sort("generated_at", -1)
    return [d async for d in docs]