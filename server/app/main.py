from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, case
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

from . import models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="RuStore Showcase API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/api/v1/apps", response_model=List[schemas.App])
def get_apps(
        db: Session = Depends(get_db),
        search: Optional[str] = None,
        sort_by: Optional[str] = None,
        category: Optional[str] = None
):
    query = db.query(models.App)

    if category:
        query = query.filter(models.App.category == category)

    if search:
        relevance = case(
            (models.App.name.ilike(f"{search}%"), 0),
            else_=1
        )
        query = query.filter(models.App.name.ilike(f"%{search}%")).order_by(relevance, models.App.name)

    elif sort_by == 'newest':
        query = query.order_by(desc(models.App.created_at))
    elif sort_by == 'popularity':
        query = query.order_by(desc(models.App.view_count))
    else:
        query = query.order_by(models.App.id)

    apps = query.all()
    return apps


@app.get("/api/v1/apps/{app_id}", response_model=schemas.App)
def get_app_by_id(app_id: int, db: Session = Depends(get_db)):
    app = db.query(models.App).filter(models.App.id == app_id).first()
    if app is None:
        raise HTTPException(status_code=404, detail="App not found")
    return app


@app.post("/api/v1/apps/{app_id}/view", response_model=schemas.App)
def increment_view_count(app_id: int, db: Session = Depends(get_db)):
    app = db.query(models.App).filter(models.App.id == app_id).first()
    if app is None:
        raise HTTPException(status_code=404, detail="App not found")

    app.view_count = (app.view_count or 0) + 1
    db.commit()
    db.refresh(app)
    return app


@app.get("/api/v1/apps/{app_id}/reviews", response_model=List[schemas.Review])
def get_reviews_for_app(app_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(models.Review.app_id == app_id).order_by(
        desc(models.Review.created_at)).all()
    return reviews


@app.post("/api/v1/apps/{app_id}/reviews", response_model=schemas.Review, status_code=201)
def create_review_for_app(app_id: int, review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    db_review = models.Review(**review.dict(), app_id=app_id)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review