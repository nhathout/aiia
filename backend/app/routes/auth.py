from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from bson import ObjectId
from ..database import db
from ..utils.auth import hash_pw, check_pw, create_token, verify_token

router = APIRouter(prefix='/auth', tags=['auth'])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class _Reg(BaseModel):
    name:str
    email:EmailStr
    password:str

@router.post("/signup")
async def signup(body:_Reg):
    if await db.users.find_one({"email":body.email}):
        raise HTTPException(400, "Email already registered")
    doc = body.dict()
    doc["password"]=hash_pw(doc.pop("password"))
    res = await db.users.insert_one(doc)
    return {"id":str(res.inserted_id), "email":body.email}

class _Login(BaseModel):
    email:EmailStr
    password:str

@router.post("/login")
async def login(body:_Login):
    user = await db.users.find_one({"email":body.email})
    if not user or not check_pw(body.password, user["password"]):
        raise HTTPException(401,"Bad credentials")
    tok = create_token(str(user["_id"]), user["email"])
    return {"access_token":tok, "token_type":"bearer"}

async def current_user(tok:str=Depends(oauth2_scheme)):
    payload = verify_token(tok)
    u = await db.users.find_one({"_id":ObjectId(payload["sub"])})
    if not u:
        raise HTTPException(status_code=401, detail="User vanished")
    return u