from pydantic import BaseModel, ConfigDict
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    name: str
    email: str
    balance: float = 15000
    savings: float = 5000
    investments: float = 8000
    debts: float = 2000
    monthlyIncome: float = 3500
    budgetHousing: float = 1200
    budgetFood: float = 500
    budgetUtilities: float = 300
    budgetSavings: float = 800
    budgetInvestments: float = 500
    completedModules: list[str] = []
    createdAt: str = ""


class UserUpdate(BaseModel):
    name: Optional[str] = None
    balance: Optional[float] = None
    savings: Optional[float] = None
    investments: Optional[float] = None
    debts: Optional[float] = None
    monthlyIncome: Optional[float] = None
    budgetHousing: Optional[float] = None
    budgetFood: Optional[float] = None
    budgetUtilities: Optional[float] = None
    budgetSavings: Optional[float] = None
    budgetInvestments: Optional[float] = None
    completedModules: Optional[list[str]] = None


class PostCreate(BaseModel):
    title: str
    category: str = "General"
    body: str


class CommentCreate(BaseModel):
    text: str


class PostResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str
    title: str
    category: str
    body: str
    author: str
    authorId: str
    likes: int = 0
    likedBy: list[str] = []
    comments: list[dict] = []
    createdAt: str = ""


class TokenResponse(BaseModel):
    token: str
    user: UserResponse


class MessageResponse(BaseModel):
    message: str
