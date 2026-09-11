import time
import uuid
from datetime import datetime
from typing import Dict, Any
from sqlalchemy.orm import Session

from backend.app.models.models import SimulationModel, SimulationResultModel
from backend.app.simulation.breach_model import BreachModel
from backend.app.simulation.reservoir_model import ReservoirModel
from backend.app.simulation.hydrograph import HydrographGenerator
from backend.app.simulation.flood_propagation import FloodPropagationModel
from backend.app.simulation.metrics import ImpactMetricsCalculator

class SimulationJobRunner:
    """
    Simulation job execution service.
    Orchestrates the breach model, reservoir model, hydrograph generator, flood propagation, and impact calculator.
    """
    def __init__(self):
        self.breach_engine = BreachModel()
        self.reservoir_engine = ReservoirModel()
        self.propagation_engine = FloodPropagationModel()

    def run_simulation_job(
        self,
        db: Session,
        sim_id: str,
        params: Dict[str, Any]
    ) -> Dict[str, Any]:
        sim_record = db.query(SimulationModel).filter(SimulationModel.id == sim_id).first()
        if not sim_record:
            return {}

        # Step 1: Update status to PROCESSING
        sim_record.status = "PROCESSING"
        sim_record.progress_percent = 20
        db.commit()

        # Step 2: Compute Breach Physics
        breach_res = self.breach_engine.calculate(
            dam_height_m=params.get("dam_height_m", 45),
            storage_volume_mcm=params.get("storage_volume_mcm", 120),
            breach_width_m=params.get("breach_width_m"),
            breach_depth_m=params.get("breach_depth_m"),
            breach_time_hours=params.get("breach_time_hours", 0.8),
            failure_mode=params.get("failure_mode", "overtopping"),
            discharge_coeff=params.get("discharge_coeff", 0.6),
            base_inflow_cms=params.get("inflow_cms", 150.0)
        )
        sim_record.progress_percent = 45
        db.commit()

        # Step 3: Generate Hydrograph
        hydrograph = HydrographGenerator.generate(
            peak_discharge_cms=breach_res["peak_discharge_cms"],
            breach_time_hours=breach_res["breach_time_hours"],
            base_inflow_cms=breach_res["base_inflow_cms"],
            duration_hours=params.get("duration_hours", 24.0)
        )

        # Step 4: Simulate Reservoir Drainage Trajectory
        reservoir_traj = self.reservoir_engine.simulate_drainage(
            initial_volume_mcm=params.get("storage_volume_mcm", 120),
            initial_water_level_m=params.get("dam_height_m", 45),
            surface_area_sqkm=4.5,
            peak_discharge_cms=breach_res["peak_discharge_cms"],
            breach_time_hours=breach_res["breach_time_hours"],
            simulation_duration_hours=params.get("duration_hours", 24.0)
        )
        sim_record.progress_percent = 70
        db.commit()

        # Step 5: Flood Propagation at T+6h (mid-simulation peak state)
        river_path = params.get("river_path", [])
        downstream_nodes = params.get("downstream_nodes", [])
        
        propagation_data = self.propagation_engine.propagate(
            peak_discharge_cms=breach_res["peak_discharge_cms"],
            current_time_hours=6.0,
            river_path_coords=river_path,
            downstream_nodes=downstream_nodes
        )

        # Step 6: Impact Analysis
        impact_metrics = ImpactMetricsCalculator.calculate_impact(
            nodes_state=propagation_data["nodes"],
            current_time_hours=6.0,
            peak_discharge_cms=breach_res["peak_discharge_cms"],
            total_released_mcm=hydrograph["total_released_volume_mcm"]
        )

        sim_record.progress_percent = 100
        sim_record.status = "COMPLETED"
        sim_record.peak_discharge_cms = breach_res["peak_discharge_cms"]
        sim_record.total_released_mcm = hydrograph["total_released_volume_mcm"]
        sim_record.max_depth_m = impact_metrics["maximum_water_depth_m"]
        sim_record.inundated_area_sqkm = impact_metrics["inundated_area_sqkm"]
        sim_record.population_at_risk = impact_metrics["population_at_risk"]
        sim_record.completed_at = datetime.utcnow()
        db.commit()

        # Step 7: Store detailed result record
        result_record = SimulationResultModel(
            id=f"res-{uuid.uuid4().hex[:8]}",
            simulation_id=sim_id,
            hydrograph_data=hydrograph,
            reservoir_trajectory=reservoir_traj,
            propagation_data=propagation_data,
            impact_metrics=impact_metrics
        )
        db.add(result_record)
        db.commit()

        return {
            "simulation": sim_record,
            "breach": breach_res,
            "hydrograph": hydrograph,
            "propagation": propagation_data,
            "metrics": impact_metrics
        }

job_runner = SimulationJobRunner()
