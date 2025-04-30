from fastapi import APIRouter, Depends
from pydantic import BaseModel, condecimal, constr
from ..utils.ai import get_portfolio
from ..utils.finance import enrich
from ..database import db
from .auth import current_user

router = APIRouter(prefix="/recommend", tags=["recommend"])

class _Req(BaseModel):
    budget: condecimal(gt=0)
    horizon: int
    risk: constr(pattern="^(low|medium|high)$")   
    preferences: list[str]
    broker: str | None = None

@router.post("/")
async def recommend(body:_Req, user=Depends(current_user)):
    raw = await get_portfolio(body.dict())
    full = await enrich(raw)
    await db.portfolios.insert_one({"user_id":user["_id"], "input":body.dict(),"holdings":full})
    return {"holdings":full}