from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .database import Base


class App(Base):
    __tablename__ = "apps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    category = Column(String, index=True)
    rating = Column(Float, default=0.0)
    # Добавьте URL'ы для иконок и скриншотов
    icon_url = Column(String)
    screenshots = Column(String)  # Будем хранить URL'ы через запятую
    developer = Column(String)
    age_rating = Column(String)

    view_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())