from motor.motor_asyncio import AsyncIOMotorClient
from .core.config import settings

if not settings().MONGO_URI:
    raise RuntimeError("MONGO_URI is missing – set it as an env variable")

mongo_client = AsyncIOMotorClient(settings().MONGO_URI)
db = mongo_client.aiia