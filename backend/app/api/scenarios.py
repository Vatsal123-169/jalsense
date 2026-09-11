import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from backend.app.core.database import get_db
from backend.app.models.models import ScenarioModel
from backend.app.schemas.schemas import ScenarioCreate, ScenarioResponse, CompareRequest
from backend.app.simulation.breach_model import BreachModel
from backend.app.simulation.hydrograph import HydrographGenerator
from backend.app.simulation.flood_propagation import FloodPropagationModel
from backend.app.simulation.metrics import ImpactMetricsCalculator

router = APIRouter(prefix="/scenarios", tags=["Scenarios"])
breach_engine = BreachModel()
propagation_engine = FloodPropagationModel()

@router.post("", response_model=ScenarioResponse, status_code=status.HTTP_201_CREATED)
def create_scenario(payload: ScenarioCreate, db: Session = Depends(get_db)):
    scen_id = f"scen-{uuid.uuid4().hex[:8]}"
    scen = ScenarioModel(
        id=scen_id,
        name=payload.name,
        description=payload.description,
        dam_name=payload.dam_name,
        dam_coords=payload.dam_coords,
        dam_height_m=payload.dam_height_m,
        storage_volume_mcm=payload.storage_volume_mcm,
        breach_width_m=payload.breach_width_m,
        breach_time_hours=payload.breach_time_hours,
        inflow_cms=payload.inflow_cms,
        failure_mode=payload.failure_mode,
        river_path=payload.river_path,
        downstream_nodes=payload.downstream_nodes
    )
    db.add(scen)
    db.commit()
    db.refresh(scen)
    return scen

@router.get("", response_model=List[ScenarioResponse])
def list_scenarios(db: Session = Depends(get_db)):
    scenarios = db.query(ScenarioModel).all()
    if not scenarios:
        # Seed default preset scenarios if empty
        return seed_default_scenarios(db)
    return scenarios

@router.get("/{scen_id}", response_model=ScenarioResponse)
def get_scenario(scen_id: str, db: Session = Depends(get_db)):
    scen = db.query(ScenarioModel).filter(ScenarioModel.id == scen_id).first()
    if not scen:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scen

@router.put("/{scen_id}", response_model=ScenarioResponse)
def update_scenario(scen_id: str, payload: ScenarioCreate, db: Session = Depends(get_db)):
    scen = db.query(ScenarioModel).filter(ScenarioModel.id == scen_id).first()
    if not scen:
        raise HTTPException(status_code=404, detail="Scenario not found")

    scen.name = payload.name
    scen.description = payload.description
    scen.dam_name = payload.dam_name
    scen.dam_coords = payload.dam_coords
    scen.dam_height_m = payload.dam_height_m
    scen.storage_volume_mcm = payload.storage_volume_mcm
    scen.breach_width_m = payload.breach_width_m
    scen.breach_time_hours = payload.breach_time_hours
    scen.inflow_cms = payload.inflow_cms
    scen.failure_mode = payload.failure_mode
    scen.river_path = payload.river_path
    scen.downstream_nodes = payload.downstream_nodes
    
    db.commit()
    db.refresh(scen)
    return scen

@router.delete("/{scen_id}")
def delete_scenario(scen_id: str, db: Session = Depends(get_db)):
    scen = db.query(ScenarioModel).filter(ScenarioModel.id == scen_id).first()
    if not scen:
        raise HTTPException(status_code=404, detail="Scenario not found")
    db.delete(scen)
    db.commit()
    return {"message": "Scenario deleted successfully", "id": scen_id}

@router.post("/compare")
def compare_scenarios(payload: CompareRequest, db: Session = Depends(get_db)):
    scenarios = db.query(ScenarioModel).filter(ScenarioModel.id.in_(payload.scenario_ids)).all()
    if not scenarios:
        raise HTTPException(status_code=404, detail="No matching scenarios found for comparison")

    comparison_results = []
    for sc in scenarios:
        breach = breach_engine.calculate(
            dam_height_m=sc.dam_height_m,
            storage_volume_mcm=sc.storage_volume_mcm,
            breach_width_m=sc.breach_width_m,
            breach_time_hours=sc.breach_time_hours,
            failure_mode=sc.failure_mode,
            base_inflow_cms=sc.inflow_cms
        )
        
        hydrograph = HydrographGenerator.generate(
            peak_discharge_cms=breach["peak_discharge_cms"],
            breach_time_hours=breach["breach_time_hours"],
            base_inflow_cms=sc.inflow_cms,
            duration_hours=24.0
        )

        propagation = propagation_engine.propagate(
            peak_discharge_cms=breach["peak_discharge_cms"],
            current_time_hours=6.0,
            river_path_coords=sc.river_path,
            downstream_nodes=sc.downstream_nodes
        )

        impact = ImpactMetricsCalculator.calculate_impact(
            nodes_state=propagation["nodes"],
            current_time_hours=6.0,
            peak_discharge_cms=breach["peak_discharge_cms"],
            total_released_mcm=hydrograph["total_released_volume_mcm"]
        )

        comparison_results.append({
            "scenario": {
                "id": sc.id,
                "name": sc.name,
                "dam_name": sc.dam_name,
                "dam_height_m": sc.dam_height_m,
                "storage_volume_mcm": sc.storage_volume_mcm,
                "breach_width_m": sc.breach_width_m,
                "breach_time_hours": sc.breach_time_hours
            },
            "breach": breach,
            "hydrograph": hydrograph,
            "propagation": propagation,
            "impact": impact
        })

    return {"count": len(comparison_results), "scenarios": comparison_results}

def seed_default_scenarios(db: Session):
    defaults = [
        {
            "id": "rishiganga",
            "name": "Rishi Ganga River Outburst (Uttarakhand)",
            "description": "Flash outburst flood along Dhauliganga & Rishi Ganga valleys",
            "dam_name": "Tapovan-Vishnugad Barrage",
            "dam_coords": [30.4952, 79.6247],
            "dam_height_m": 48.0,
            "storage_volume_mcm": 65.0,
            "breach_width_m": 120.0,
            "breach_time_hours": 0.8,
            "inflow_cms": 200.0,
            "failure_mode": "overtopping",
            "river_path": [[30.4952, 79.6247], [30.4810, 79.5980], [30.4650, 79.5630], [30.4420, 79.5100], [30.4180, 79.4600], [30.3400, 79.3300]],
            "downstream_nodes": [
                {"name": "Tapovan Barrage Site", "distanceKm": 4.5, "population": 450, "coords": [30.4810, 79.5980]},
                {"name": "Raini Chakta Village", "distanceKm": 11.2, "population": 1850, "coords": [30.4650, 79.5630]},
                {"name": "Joshimath Lower Ridge", "distanceKm": 22.8, "population": 12400, "coords": [30.4180, 79.4600]},
                {"name": "Chamoli HQ", "distanceKm": 48.0, "population": 32000, "coords": [30.3400, 79.3300]}
            ]
        },
        {
            "id": "teesta",
            "name": "Teesta Stage-III Dam Breach (Sikkim)",
            "description": "Glacial lake outburst flood (GLOF) dam break in North Sikkim",
            "dam_name": "Chungthang Hydro Dam",
            "dam_coords": [27.6042, 88.6475],
            "dam_height_m": 60.0,
            "storage_volume_mcm": 145.0,
            "breach_width_m": 160.0,
            "breach_time_hours": 1.2,
            "inflow_cms": 350.0,
            "failure_mode": "overtopping",
            "river_path": [[27.6042, 88.6475], [27.5180, 88.5420], [27.3820, 88.5080], [27.2340, 88.4720], [27.1750, 88.5320]],
            "downstream_nodes": [
                {"name": "Chungthang Powerhouse", "distanceKm": 3.2, "population": 820, "coords": [27.5840, 88.6120]},
                {"name": "Mangan Township", "distanceKm": 18.5, "population": 8600, "coords": [27.5180, 88.5420]},
                {"name": "Singtam Highway Bridge", "distanceKm": 38.0, "population": 19500, "coords": [27.2340, 88.4720]},
                {"name": "Rangpo Border Town", "distanceKm": 54.2, "population": 28000, "coords": [27.1750, 88.5320]}
            ]
        },
        {
            "id": "bhakra",
            "name": "Bhakra Dam Extreme PMF Scenario",
            "description": "Probable Maximum Flood (PMF) dam overtopping simulation",
            "dam_name": "Bhakra High Gravity Dam",
            "dam_coords": [31.4116, 76.4358],
            "dam_height_m": 226.0,
            "storage_volume_mcm": 9620.0,
            "breach_width_m": 420.0,
            "breach_time_hours": 2.8,
            "inflow_cms": 1200.0,
            "failure_mode": "overtopping",
            "river_path": [[31.4116, 76.4358], [31.3700, 76.3800], [31.2300, 76.5000], [31.1000, 76.5200]],
            "downstream_nodes": [
                {"name": "Nangal Hydel Canal", "distanceKm": 9.8, "population": 14500, "coords": [31.3700, 76.3800]},
                {"name": "Anandpur Sahib Basin", "distanceKm": 27.5, "population": 42000, "coords": [31.2300, 76.5000]},
                {"name": "Ropar Headworks", "distanceKm": 48.0, "population": 78000, "coords": [31.1000, 76.5200]}
            ]
        }
    ]

    seeded = []
    for d in defaults:
        scen = ScenarioModel(**d)
        db.add(scen)
        seeded.append(scen)
    db.commit()
    return seeded
