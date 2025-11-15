from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import desc
from typing import List, Optional
from . import models, schemas
from .database import SessionLocal, engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="RuStore Showcase API")

# === Настройка CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# === API Эндпоинты ===

@app.get("/api/v1/apps", response_model=List[schemas.App])
def get_apps(
        db: Session = Depends(get_db),
        search: Optional[str] = None,  # <-- Добавили необязательный параметр поиска
        sort_by: Optional[str] = None  # <-- Добавили необязательный параметр сортировки
):
    """
    Получить список всех приложений с возможностью поиска и сортировки.
    - sort_by: 'newest' (по дате добавления) или 'popularity' (по просмотрам)
    """
    query = db.query(models.App)  # Начинаем с базового запроса "выбрать все"

    # 1. Применяем поиск, если он есть
    if search:
        # Ищем совпадения в названии или описании, без учета регистра
        query = query.filter(models.App.name.ilike(f"%{search}%"))

    # 2. Применяем сортировку, если она есть
    if sort_by == 'newest':
        query = query.order_by(desc(models.App.created_at))
    elif sort_by == 'popularity':
        query = query.order_by(desc(models.App.view_count))

    # 3. Выполняем итоговый запрос
    apps = query.all()
    return apps


@app.get("/api/v1/apps/{app_id}", response_model=schemas.App)
def get_app_by_id(app_id: int, db: Session = Depends(get_db)):
    """Получить одно приложение по его ID."""
    app = db.query(models.App).filter(models.App.id == app_id).first()
    if app is None:
        raise HTTPException(status_code=404, detail="App not found")
    return app


@app.post("/api/v1/apps/{app_id}/view", response_model=schemas.App)
def increment_view_count(app_id: int, db: Session = Depends(get_db)):
    """Увеличить счетчик просмотров приложения."""
    app = db.query(models.App).filter(models.App.id == app_id).first()
    if app is None:
        raise HTTPException(status_code=404, detail="App not found")

    app.view_count += 1
    db.commit()
    db.refresh(app)
    return app
