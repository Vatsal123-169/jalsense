# app/schemas/construction_validation.py
"""
Construction Validation schema for FLOODSIM (SIH26161).

Validates Reservoir/Dam, Breach, and Simulation parameters as described
in the FLOODSIM spec (Section 11 - SIMULATION INPUTS):
"Validate every input. Show minimum, maximum, units, helpful descriptions.
Prevent invalid combinations."

This is a PROTOTYPE-level engineering sanity check, not a substitute for
a validated hydraulic/structural review.
"""

from pydantic import BaseModel, Field, field_validator, model_validator


class DamConstructionInput(BaseModel):
    # --- Reservoir / Dam ---
    dam_name: str = Field(..., min_length=2, max_length=100)
    dam_height_m: float = Field(..., gt=0, le=300, description="Dam height in meters (0-300m)")
    initial_water_level_m: float = Field(..., gt=0, description="Initial water level in meters")
    reservoir_volume_m3: float = Field(..., gt=0, description="Reservoir volume in cubic meters")
    reservoir_surface_area_m2: float = Field(..., gt=0, description="Reservoir surface area in square meters")
    dam_latitude: float = Field(..., ge=-90, le=90)
    dam_longitude: float = Field(..., ge=-180, le=180)

    # --- Breach ---
    breach_width_m: float = Field(..., gt=0, description="Final breach width in meters")
    breach_depth_m: float = Field(..., gt=0, description="Final breach depth in meters")
    breach_formation_time_min: float = Field(..., gt=0, le=1440, description="Breach formation time in minutes (max 24h)")
    discharge_coefficient_cd: float = Field(..., ge=0.1, le=1.0, description="Discharge coefficient (typically 0.1-1.0)")

    # --- Simulation ---
    simulation_duration_min: float = Field(..., gt=0, le=10080, description="Simulation duration in minutes (max 7 days)")
    time_step_sec: float = Field(..., gt=0, le=3600, description="Time step in seconds")
    scenario_name: str = Field(..., min_length=2, max_length=100)

    # ---------- Field-level sanity checks ----------

    @field_validator("dam_name", "scenario_name")
    @classmethod
    def no_blank_strings(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field cannot be blank or whitespace only.")
        return v.strip()

    # ---------- Cross-field engineering constraints ----------

    @model_validator(mode="after")
    def validate_water_level_within_dam(self):
        if self.initial_water_level_m > self.dam_height_m:
            raise ValueError(
                f"Initial water level ({self.initial_water_level_m}m) cannot exceed "
                f"dam height ({self.dam_height_m}m)."
            )
        return self

    @model_validator(mode="after")
    def validate_breach_depth_within_dam(self):
        if self.breach_depth_m > self.dam_height_m:
            raise ValueError(
                f"Breach depth ({self.breach_depth_m}m) cannot exceed dam height "
                f"({self.dam_height_m}m)."
            )
        return self

    @model_validator(mode="after")
    def validate_breach_width_reasonable(self):
        # Sanity bound: breach width shouldn't be an unrealistic multiple of dam height
        max_reasonable_width = self.dam_height_m * 50
        if self.breach_width_m > max_reasonable_width:
            raise ValueError(
                f"Breach width ({self.breach_width_m}m) is unrealistically large "
                f"relative to dam height ({self.dam_height_m}m). Max expected: "
                f"{max_reasonable_width}m."
            )
        return self

    @model_validator(mode="after")
    def validate_time_step_vs_duration(self):
        duration_sec = self.simulation_duration_min * 60
        if self.time_step_sec >= duration_sec:
            raise ValueError(
                "Time step must be smaller than the total simulation duration."
            )
        # Prevent excessively coarse time steps that would make the simulation meaningless
        if duration_sec / self.time_step_sec < 10:
            raise ValueError(
                "Time step is too large relative to simulation duration "
                "(need at least 10 simulation steps)."
            )
        return self

    @model_validator(mode="after")
    def validate_reservoir_consistency(self):
        # Basic physical consistency: volume should roughly relate to surface area x depth
        # (very loose sanity check, not a precise geometric validation)
        implied_avg_depth = self.reservoir_volume_m3 / self.reservoir_surface_area_m2
        if implied_avg_depth > self.dam_height_m * 2:
            raise ValueError(
                "Reservoir volume and surface area imply an average depth "
                f"({implied_avg_depth:.1f}m) that is inconsistent with dam height "
                f"({self.dam_height_m}m). Check your input values."
            )
        return self


class ConstructionValidationResponse(BaseModel):
    is_valid: bool
    errors: list[str] = []
    warnings: list[str] = []
