from sqlalchemy import Column, String, Float, Integer, Text, DateTime, JSON
from datetime import datetime
from backend.app.core.database import Base

class DamModel(Base):
    __tablename__ = "dams"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    river_name = Column(String, nullable=True)
    state = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    height_m = Column(Float, nullable=False)
    storage_capacity_mcm = Column(Float, nullable=False)
    surface_area_sqkm = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ScenarioModel(Base):
    __tablename__ = "scenarios"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    dam_id = Column(String, nullable=True)
    dam_name = Column(String, nullable=False)
    dam_coords = Column(JSON, nullable=False)
    dam_height_m = Column(Float, nullable=False)
    storage_volume_mcm = Column(Float, nullable=False)
    breach_width_m = Column(Float, nullable=False)
    breach_depth_m = Column(Float, nullable=True)
    breach_time_hours = Column(Float, nullable=False)
    discharge_coeff = Column(Float, default=0.6)
    inflow_cms = Column(Float, default=150.0)
    failure_mode = Column(String, default="overtopping")
    river_path = Column(JSON, nullable=False)
    downstream_nodes = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class SimulationModel(Base):
    __tablename__ = "simulations"

    id = Column(String, primary_key=True, index=True)
    scenario_id = Column(String, nullable=True)
    name = Column(String, nullable=False)
    status = Column(String, default="QUEUED") # QUEUED, PROCESSING, COMPLETED, FAILED
    progress_percent = Column(Integer, default=0)
    duration_hours = Column(Float, default=24.0)
    time_step_mins = Column(Float, default=15.0)
    peak_discharge_cms = Column(Float, nullable=True)
    total_released_mcm = Column(Float, nullable=True)
    max_depth_m = Column(Float, nullable=True)
    inundated_area_sqkm = Column(Float, nullable=True)
    population_at_risk = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class SimulationResultModel(Base):
    __tablename__ = "simulation_results"

    id = Column(String, primary_key=True, index=True)
    simulation_id = Column(String, nullable=False, index=True)
    hydrograph_data = Column(JSON, nullable=False)
    reservoir_trajectory = Column(JSON, nullable=False)
    propagation_data = Column(JSON, nullable=False)
    impact_metrics = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DatasetModel(Base):
    __tablename__ = "datasets"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    data_type = Column(String, nullable=False) # DEM, River, Dam, Satellite, LandUse
    format = Column(String, nullable=False) # GeoJSON, SHP, KML, CSV, GeoTIFF
    size_mb = Column(Float, nullable=False)
    status = Column(String, default="ACTIVE")
    uploaded_at = Column(DateTime, default=datetime.utcnow)

class ExportJobModel(Base):
    __tablename__ = "export_jobs"

    id = Column(String, primary_key=True, index=True)
    simulation_id = Column(String, nullable=False)
    format = Column(String, nullable=False) # GeoJSON, CSV, KML, SHP, PDF
    status = Column(String, default="COMPLETED")
    download_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
