import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "ecofinapp")
JWT_SECRET = os.getenv("JWT_SECRET", "ecofinapp_jwt_secret_key_2024")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DAYS = 7
PORT = int(os.getenv("PORT", "3001"))
