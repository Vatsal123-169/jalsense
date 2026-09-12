# app/routes/construction_validation_routes.py
from fastapi import APIRouter
from app.schemas.construction_validation import ConstructionValidationResponse
from app.services.construction_validation_service import validate_construction_input

router = APIRouter(prefix="/api/validate", tags=["Construction Validation"])


@router.post("/construction", response_model=ConstructionValidationResponse)
def validate_construction(payload: dict):
    """
    Validates dam/reservoir/breach/simulation parameters BEFORE a
    simulation job is created. Call this from the Simulation Workspace
    form as the user fills it in, and again server-side before
    POST /api/simulations to guarantee no invalid job is ever queued.
    """
    return validate_construction_input(payload)
