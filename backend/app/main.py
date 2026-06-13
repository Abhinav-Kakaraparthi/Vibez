from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="VibeZ MVP API")
app.include_router(router, prefix="/api")