from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, case
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm

from . import models, schemas, auth, database

from .database import get_db, engine

import random


models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="RuStore Showcase API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# API Аутентификации
@app.post("/api/v1/auth/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/v1/auth/login", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.get_user(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/v1/users/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)):
    return current_user

# API Приложений и Отзывов
@app.get("/api/v1/apps", response_model=List[schemas.App])
def get_apps(db: Session = Depends(get_db), search: Optional[str] = None, sort_by: Optional[str] = None, category: Optional[str] = None):
    query = db.query(models.App)
    if category: query = query.filter(models.App.category == category)
    if search:
        relevance = case((models.App.name.ilike(f"{search}%"), 0), else_=1)
        query = query.filter(models.App.name.ilike(f"%{search}%")).order_by(relevance, models.App.name)
    elif sort_by == 'newest': query = query.order_by(desc(models.App.created_at))
    elif sort_by == 'popularity': query = query.order_by(desc(models.App.view_count))
    else: query = query.order_by(models.App.id)
    return query.all()

@app.get("/api/v1/apps/{app_id}", response_model=schemas.App)
def get_app_by_id(app_id: int, db: Session = Depends(get_db)):
    app = db.query(models.App).filter(models.App.id == app_id).first()
    if app is None: raise HTTPException(status_code=404, detail="App not found")
    return app

@app.post("/api/v1/apps/{app_id}/view", response_model=schemas.App)
def increment_view_count(app_id: int, db: Session = Depends(get_db)):
    app = db.query(models.App).filter(models.App.id == app_id).first()
    if app is None: raise HTTPException(status_code=404, detail="App not found")
    app.view_count = (app.view_count or 0) + 1
    db.commit()
    db.refresh(app)
    return app

@app.get("/api/v1/apps/{app_id}/reviews", response_model=List[schemas.Review])
def get_reviews_for_app(app_id: int, db: Session = Depends(get_db)):
    return db.query(models.Review).filter(models.Review.app_id == app_id).order_by(desc(models.Review.created_at)).all()

@app.post("/api/v1/apps/{app_id}/reviews", response_model=schemas.Review, status_code=201)
@app.post("/api/v1/apps/{app_id}/reviews", response_model=schemas.Review, status_code=201)
def create_review_for_app(
    app_id: int,
    review: schemas.ReviewCreate,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    db_review = models.Review(
        app_id=app_id,
        author=current_user.username,  # автор из текущего пользователя
        **review.dict()
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


@app.post("/api/v1/events", response_model=schemas.User)  # <-- ИЗМЕНЕНИЕ: Добавляем response_model
def track_event(
        event: schemas.Event,
        current_user: schemas.User = Depends(auth.get_current_user),
        db: Session = Depends(get_db)
):
    """Отслеживает действия пользователя и возвращает обновленного пользователя."""
    xp_gained = 0
    pixels_gained = 0

    if event.type == "APP_VIEWED":
        xp_gained = 5
    elif event.type == "REVIEW_POSTED":
        xp_gained = 25
        pixels_gained = 10

    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.xp = (user.xp or 0) + xp_gained
    user.pixels = (user.pixels or 0) + pixels_gained

    xp_for_next_level = user.level * 100
    if user.xp >= xp_for_next_level:
        user.level += 1
        user.xp -= xp_for_next_level
        user.pixels += 100

    db.commit()
    db.refresh(user)

    return user

@app.post("/api/v1/wheel/spin")
def spin_wheel(
        current_user: schemas.User = Depends(auth.get_current_user),
        db: Session = Depends(get_db)
):
    """Вращает Колесо Удачи."""
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=403, detail="User not found")

    spin_cost = 100
    if user.pixels < spin_cost:
        raise HTTPException(status_code=400, detail="Недостаточно Пикселей для вращения!")

    prizes = [
        {"type": "pixels", "value": 50, "chance": 40},
        {"type": "pixels", "value": 150, "chance": 30},
        {"type": "pixels", "value": 300, "chance": 15},
        {"type": "xp", "value": 100, "chance": 10},
        {"type": "promo", "value": "VK Музыка на месяц", "chance": 5},
    ]

    roll = random.randint(1, 100)
    cumulative_chance = 0
    won_prize = None
    for prize in prizes:
        cumulative_chance += prize['chance']
        if roll <= cumulative_chance:
            won_prize = prize
            break

    user.pixels -= spin_cost
    if won_prize['type'] == 'pixels':
        user.pixels += won_prize['value']
    elif won_prize['type'] == 'xp':
        user.xp += won_prize['value']

    db.commit()
    db.refresh(user)

    return {"prize": won_prize, "updated_user": schemas.User.from_orm(user)}


# --- Магазин Наград (MVP) ---

# Статичный список наград магазина.

STORE_ITEMS = [
    {
        "id": 1,
        "name": "Стикеры VK",
        "description": "Набор фирменных стикеров VK для чатов.",
        "price": 300,
        "image_url": "https://via.placeholder.com/300x180.png?text=VK+Stickers",
    },
    {
        "id": 2,
        "name": "VK Музыка — 1 месяц",
        "description": "Тестовая подписка VK Музыка на 1 месяц.",
        "price": 500,
        "image_url": "https://via.placeholder.com/300x180.png?text=VK+Music",
    },
    {
        "id": 3,
        "name": "Бейдж \"Пионер Экспедиции\"",
        "description": "Косметический бейдж внутри профиля (для демо).",
        "price": 150,
        "image_url": "https://via.placeholder.com/300x180.png?text=Explorer+Badge",
    },
]


@app.get("/api/v1/store/items", response_model=List[schemas.StoreItem])
def get_store_items():
    """
    Возвращает список всех доступных наград в магазине.
    """
    # Просто отдаем статичный список
    return STORE_ITEMS


@app.post("/api/v1/store/buy")
def buy_store_item(
        purchase: schemas.StorePurchaseRequest,
        current_user: schemas.User = Depends(auth.get_current_user),
        db: Session = Depends(get_db),
):
    """
    Покупка награды в магазине за Пиксели.
    Списывает стоимость с баланса пользователя и возвращает:
    - купленный item
    - обновленного пользователя (updated_user)
    """

    # Ищем нужный товар по id
    item = next((i for i in STORE_ITEMS if i["id"] == purchase.item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Товар не найден")

    # Находим пользователя в базе
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=403, detail="User not found")

    # Проверяем баланс
    if (user.pixels or 0) < item["price"]:
        raise HTTPException(status_code=400, detail="Недостаточно Пикселей для покупки")

    # Списываем Пиксели
    user.pixels = (user.pixels or 0) - item["price"]

    db.commit()
    db.refresh(user)

    return {
        "item": item,
        "updated_user": schemas.User.from_orm(user),
    }
