# Integration notes for Construction Validation module

## Backend
No new dependencies — uses Pydantic v2, already required by the FLOODSIM
spec. Just drop these three files into your existing structure:

  backend/app/schemas/construction_validation.py
  backend/app/services/construction_validation_service.py
  backend/app/routes/construction_validation_routes.py

Then register the router in backend/app/main.py (see main_py_wiring.txt).

New endpoint:
  POST /api/validate/construction

Example request body:
{
  "dam_name": "Demo Valley Dam",
  "dam_height_m": 45,
  "initial_water_level_m": 40,
  "reservoir_volume_m3": 5000000,
  "reservoir_surface_area_m2": 250000,
  "dam_latitude": 30.5,
  "dam_longitude": 78.3,
  "breach_width_m": 30,
  "breach_depth_m": 20,
  "breach_formation_time_min": 30,
  "discharge_coefficient_cd": 0.6,
  "simulation_duration_min": 120,
  "time_step_sec": 10,
  "scenario_name": "Moderate Breach"
}

## Frontend
Requires (if not already installed):
  npm install react-hook-form zod @hookform/resolvers

Drop these two files into your Next.js project:
  lib/validation/constructionValidationSchema.ts
  components/ConstructionValidationForm.tsx

Usage in your Simulation Workspace page:

  import ConstructionValidationForm from "@/components/ConstructionValidationForm";

  <ConstructionValidationForm
    onValidated={(data) => {
      // proceed to POST /api/simulations with validated data
    }}
  />

## Why two validation layers (client + server)
- Zod on the frontend gives instant feedback as the user types (matches
  Section 11's "validation, min/max, units, tooltips" requirement).
- Pydantic on the backend guarantees no invalid job ever reaches the
  simulation queue, even if someone calls the API directly (e.g. via
  Postman, bypassing the UI entirely).

Both schemas enforce the same rules; if you change one, update the other.
