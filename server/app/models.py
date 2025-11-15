from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    # Поля для геймификации
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    pixels = Column(Integer, default=0)


class App(Base):
    __tablename__ = "apps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    category = Column(String, index=True)
    rating = Column(Float, default=0.0)
    icon_url = Column(String)
    screenshots = Column(String)
    developer = Column(String)
    age_rating = Column(String)

    view_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    reviews = relationship("Review", back_populates="app")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    author = Column(String, default="Аноним")
    text = Column(String)
    rating = Column(Integer)  # Оценка от 1 до 5
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    app_id = Column(Integer, ForeignKey("apps.id"))
    app = relationship("App", back_populates="reviews")