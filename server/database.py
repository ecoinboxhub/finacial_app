from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGODB_URI, DATABASE_NAME

client: AsyncIOMotorClient | None = None


async def connect_db():
    global client
    client = AsyncIOMotorClient(MONGODB_URI)
    print(f"Connected to MongoDB: {DATABASE_NAME}")
    return get_db()


def get_db():
    if client is None:
        raise RuntimeError("Database not connected. Call connect_db() first.")
    return client[DATABASE_NAME]


async def close_db():
    global client
    if client:
        client.close()
        client = None
