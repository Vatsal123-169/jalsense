from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class SimulationCreate(BaseModel):
    name: str = "Rishi Ganga Dam Breach Simulation"
    scenario_id: Optional[str] = "rishiganga"
    dam_height_m: float = Field(..., gt=0, description="Height of dam in meters")
    storage_volume_mcm: float = Field(..., gt=0, description="Reservoir volume in MCM")
    breach_width_m: Optional[float] = Field(None, description="Final breach width (m)")
    breach_depth_m: Optional[float] = Field(None, description="Final breach depth (m)")
    breach_time_hours: float = Field(0.8, gt=0, description="Breach formation time in hours")
    discharge_coeff: float = Field(0.6, ge=0.1, le=1.0, description="Discharge coefficient Cd")
    inflow_cms: float = Field(150.0, ge=0, description="Base river inflow (m3/s)")
    failure_mode: str = Field("overtopping", description="overtopping or piping")
    duration_hours: float = Field(24.0, gt=0, description="Simulation duration in hours")
    dam_coords: List[float] = Field(default=[30.4952, 79.6247])
    river_path: List[List[float]] = Field(default=[[30.4952, 79.6247], [30.4810, 79.5980], [30.4650, 79.5630], [30.3400, 79.3300]])
    downstream_nodes: List[Dict[str, Any]] = Field(default=[])

class SimulationResponse(BaseModel):
    id: str
    scenario_id: Optional[str]
    name: str
    status: str
    progress_percent: int
    duration_hours: float
    peak_discharge_cms: Optional[float]
    total_released_mcm: Optional[float]
    max_depth_m: Optional[float]
    inundated_area_sqkm: Optional[float]
    population_at_risk: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

class HydrographPoint(BaseModel):
    time_hours: float
    discharge_cms: float

class HydrographResponse(BaseModel):
    time_series: List[HydrographPoint]
    peak_discharge_cms: float
    time_to_peak_hours: float
    total_released_volume_mcm: float

class DownstreamNodeState(BaseModel):
    name: str
    distanceKm: float
    population: int
    coords: List[float]
    timeOfArrivalHours: float
    currentDepthM: float
    currentVelocityMS: float
    status: str

class SimulationResultResponse(BaseModel):
    simulation_id: str
    hydrograph: HydrographResponse
    reservoir_trajectory: List[Dict[str, Any]]
    propagation: Dict[str, Any]
    impact_metrics: Dict[str, Any]

class ScenarioCreate(BaseModel):
    name: str
    description: Optional[str] = None
    dam_name: str
    dam_coords: List[float]
    dam_height_m: float
    storage_volume_mcm: float
    breach_width_m: float
    breach_time_hours: float
    inflow_cms: float = 150.0
    failure_mode: str = "overtopping"
    river_path: List[List[float]]
    downstream_nodes: List[Dict[str, Any]]

class ScenarioResponse(ScenarioCreate):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class CompareRequest(BaseModel):
    scenario_ids: List[str]

class ExportRequest(BaseModel):
    simulation_id: str
    format: str = "GeoJSON" # GeoJSON, CSV, KML, SHP, PDF
