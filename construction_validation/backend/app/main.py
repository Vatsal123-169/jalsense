from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.routes.construction_validation_routes import router as construction_validation_router

app = FastAPI(title="Construction Validation", version="1.0.0")
app.include_router(construction_validation_router)
WEB_DIRECTORY = Path(__file__).resolve().parents[1] / "web"
app.mount("/", StaticFiles(directory=WEB_DIRECTORY, html=True), name="web")
