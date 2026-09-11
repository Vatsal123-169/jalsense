import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from backend.app.core.database import get_db
from backend.app.models.models import SimulationModel, SimulationResultModel, ScenarioModel
from backend.app.schemas.schemas import SimulationCreate, SimulationResponse, SimulationResultResponse
from backend.app.services.job_runner import job_runner

router = APIRouter(prefix="/simulations", tags=["Simulations"])

@router.post("", response_model=SimulationResponse, status_code=status.HTTP_201_CREATED)
def create_simulation(payload: SimulationCreate, db: Session = Depends(get_db)):
    sim_id = f"sim-{uuid.uuid4().hex[:8]}"
    
    sim = SimulationModel(
        id=sim_id,
        scenario_id=payload.scenario_id,
        name=payload.name,
        status="QUEUED",
        progress_percent=0,
        duration_hours=payload.duration_hours,
        time_step_mins=15.0
    )
    db.add(sim)
    db.commit()
    db.refresh(sim)

    # Immediately execute prototype physics job
    job_runner.run_simulation_job(db, sim_id, payload.dict())
    db.refresh(sim)
    return sim

@router.get("", response_model=List[SimulationResponse])
def list_simulations(db: Session = Depends(get_db)):
    return db.query(SimulationModel).order_by(SimulationModel.created_at.desc()).all()

@router.get("/{sim_id}", response_model=SimulationResponse)
def get_simulation(sim_id: str, db: Session = Depends(get_db)):
    sim = db.query(SimulationModel).filter(SimulationModel.id == sim_id).first()
    if not sim:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return sim

@router.post("/{sim_id}/run")
def run_simulation(sim_id: str, db: Session = Depends(get_db)):
    sim = db.query(SimulationModel).filter(SimulationModel.id == sim_id).first()
    if not sim:
        raise HTTPException(status_code=404, detail="Simulation not found")

    # Fetch scenario params if linked
    params = {
        "dam_height_m": 48.0,
        "storage_volume_mcm": 65.0,
        "breach_width_m": 120.0,
        "breach_time_hours": 0.8,
        "inflow_cms": 200.0,
        "failure_mode": "overtopping",
        "duration_hours": 24.0
    }
    
    res = job_runner.run_simulation_job(db, sim_id, params)
    return {"message": "Simulation executed successfully", "status": "COMPLETED", "summary": res.get("metrics")}

@router.get("/{sim_id}/status")
def get_simulation_status(sim_id: str, db: Session = Depends(get_db)):
    sim = db.query(SimulationModel).filter(SimulationModel.id == sim_id).first()
    if not sim:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return {
        "id": sim.id,
        "status": sim.status,
        "progress_percent": sim.progress_percent,
        "completed_at": sim.completed_at
    }

@router.get("/{sim_id}/results")
def get_simulation_results(sim_id: str, db: Session = Depends(get_db)):
    result = db.query(SimulationResultModel).filter(SimulationResultModel.simulation_id == sim_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Simulation results not ready")
    return {
        "simulation_id": sim_id,
        "hydrograph": result.hydrograph_data,
        "reservoir_trajectory": result.reservoir_trajectory,
        "propagation": result.propagation_data,
        "impact_metrics": result.impact_metrics
    }

@router.get("/{sim_id}/hydrograph")
def get_hydrograph(sim_id: str, db: Session = Depends(get_db)):
    result = db.query(SimulationResultModel).filter(SimulationResultModel.simulation_id == sim_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Hydrograph data not found")
    return result.hydrograph_data
