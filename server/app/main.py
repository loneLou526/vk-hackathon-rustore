from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, case
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm

from . import models, schemas, auth, database

from .database import get_db, engine

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
def create_review_for_app(app_id: int, review: schemas.ReviewCreate, current_user: schemas.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # Привязываем автора отзыва к текущему пользователю
    db_review = models.Review(**review.dict(), app_id=app_id, author=current_user.username)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review