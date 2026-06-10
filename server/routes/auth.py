from fastapi import APIRouter, HTTPException, status
from models import UserCreate, UserLogin, UserResponse, TokenResponse, MessageResponse, UserUpdate
from database import get_db
from auth_utils import hash_password, verify_password, create_access_token
from bson import ObjectId
from datetime import datetime, timezone

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate):
    db = get_db()
    users_collection = db["users"]

    existing = await users_collection.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    user_doc = {
        "name": data.name,
        "email": data.email.lower(),
        "password": hash_password(data.password),
        "balance": 15000,
        "savings": 5000,
        "investments": 8000,
        "debts": 2000,
        "monthlyIncome": 3500,
        "budgetHousing": 1200,
        "budgetFood": 500,
        "budgetUtilities": 300,
        "budgetSavings": 800,
        "budgetInvestments": 500,
        "completedModules": [],
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    result = await users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)
    token = create_access_token(user_id, data.email.lower())

    return TokenResponse(
        token=token,
        user=UserResponse(
            id=user_id,
            name=data.name,
            email=data.email.lower(),
            createdAt=user_doc["createdAt"],
        ),
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    db = get_db()
    users_collection = db["users"]

    user = await users_collection.find_one({"email": data.email.lower()})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id = str(user["_id"])
    token = create_access_token(user_id, user["email"])

    return TokenResponse(
        token=token,
        user=UserResponse(
            id=user_id,
            name=user["name"],
            email=user["email"],
            balance=user.get("balance", 15000),
            savings=user.get("savings", 5000),
            investments=user.get("investments", 8000),
            debts=user.get("debts", 2000),
            monthlyIncome=user.get("monthlyIncome", 3500),
            budgetHousing=user.get("budgetHousing", 1200),
            budgetFood=user.get("budgetFood", 500),
            budgetUtilities=user.get("budgetUtilities", 300),
            budgetSavings=user.get("budgetSavings", 800),
            budgetInvestments=user.get("budgetInvestments", 500),
            completedModules=user.get("completedModules", []),
            createdAt=user.get("createdAt", ""),
        ),
    )


@router.post("/reset", response_model=MessageResponse)
async def reset_password(data: UserLogin):
    db = get_db()
    users_collection = db["users"]

    user = await users_collection.find_one({"email": data.email.lower()})
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email")

    new_password = hash_password("password123")
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": new_password}},
    )

    return MessageResponse(message='Password has been reset to "password123"')
