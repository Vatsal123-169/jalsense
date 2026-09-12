# app/services/construction_validation_service.py
"""
Service layer for construction validation. Keeps the validation logic
callable from both the API route and the simulation pipeline itself
(so a simulation can never run on unvalidated input).
"""

from pydantic import ValidationError
from app.schemas.construction_validation import (
    DamConstructionInput,
    ConstructionValidationResponse,
)


def validate_construction_input(raw_input: dict) -> ConstructionValidationResponse:
    """
    Validates raw dam/reservoir/breach/simulation input.
    Returns a structured response instead of raising, so the API layer
    can return a clean 200 with validation details rather than a 500.
    """
    errors: list[str] = []
    warnings: list[str] = []

    try:
        validated = DamConstructionInput(**raw_input)
    except ValidationError as e:
        for err in e.errors():
            field = ".".join(str(loc) for loc in err["loc"]) or "input"
            errors.append(f"{field}: {err['msg']}")
        return ConstructionValidationResponse(is_valid=False, errors=errors, warnings=warnings)

    # Soft warnings — valid input, but worth flagging to the user
    if validated.discharge_coefficient_cd < 0.3:
        warnings.append(
            "Discharge coefficient is unusually low (<0.3) — double-check this value."
        )

    if validated.breach_formation_time_min < 5:
        warnings.append(
            "Breach formation time under 5 minutes represents a near-instantaneous "
            "failure — ensure this is intentional for your scenario."
        )

    if validated.simulation_duration_min > 4320:  # > 3 days
        warnings.append(
            "Simulation duration exceeds 3 days — consider whether this is necessary "
            "for your scenario, as it will increase compute time."
        )

    return ConstructionValidationResponse(is_valid=True, errors=[], warnings=warnings)
