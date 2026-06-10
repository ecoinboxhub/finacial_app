from fastapi import APIRouter, Depends, HTTPException
from models import UserResponse, UserUpdate
from database import get_db
from auth_utils import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    db = get_db()
    users_collection = db["users"]

    user = await users_collection.find_one({"_id": ObjectId(current_user["user_id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=str(user["_id"]),
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
    )


@router.put("/profile", response_model=UserResponse)
async def update_profile(data: UserUpdate, current_user: dict = Depends(get_current_user)):
    db = get_db()
    users_collection = db["users"]

    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    await users_collection.update_one(
        {"_id": ObjectId(current_user["user_id"])},
        {"$set": update_data},
    )

    user = await users_collection.find_one({"_id": ObjectId(current_user["user_id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=str(user["_id"]),
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
    )
