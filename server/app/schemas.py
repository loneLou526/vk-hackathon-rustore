from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

# --- Схемы для Отзывов ---
class ReviewBase(BaseModel):
    author: str
    text: str
    rating: int

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
    created_at: datetime
    app_id: int

    class Config:
        orm_mode = True

# --- Схемы для Приложений ---
class AppBase(BaseModel):
    name: str
    description: str
    category: str
    icon_url: str
    screenshots: str
    developer: str
    age_rating: str

class AppCreate(AppBase):
    pass

class App(AppBase):
    id: int
    rating: float
    view_count: int
    created_at: datetime

    class Config:
        orm_mode = True

# --- Схемы для Пользователей и Токенов ---
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=72)

class User(UserBase):
    id: int
    is_active: bool
    level: int
    xp: int
    pixels: int

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None