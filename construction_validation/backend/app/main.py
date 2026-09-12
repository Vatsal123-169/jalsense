from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.routes.construction_validation_routes import router as construction_validation_router

app = FastAPI(title="Construction Validation", version="1.0.0")
app.include_router(construction_validation_router)

BACKEND_DIRECTORY = Path(__file__).resolve().parents[1]
PROJECT_DIRECTORY = BACKEND_DIRECTORY.parent
app.mount("/static", StaticFiles(directory=BACKEND_DIRECTORY / "web"), name="static")


@app.get("/", include_in_schema=False)
def homepage() -> FileResponse:
    """Serve the project-level browser entry point."""
    return FileResponse(PROJECT_DIRECTORY / "index.html")
