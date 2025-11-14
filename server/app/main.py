from fastapi import FastAPI

app = FastAPI(title="RuStore Showcase API")

@app.get("/")
def read_root():
    return {"message": "Welcome to RuStore Showcase API!"}