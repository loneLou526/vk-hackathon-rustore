from pydantic import BaseModel
from datetime import datetime
from typing import List

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