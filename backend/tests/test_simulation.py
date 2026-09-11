import pytest
from backend.app.simulation.breach_model import BreachModel
from backend.app.simulation.hydrograph import HydrographGenerator
from backend.app.simulation.flood_propagation import FloodPropagationModel
from backend.app.simulation.metrics import ImpactMetricsCalculator

def test_breach_model_calculation():
    engine = BreachModel()
    res = engine.calculate(
        dam_height_m=48.0,
        storage_volume_mcm=65.0,
        breach_width_m=120.0,
        breach_time_hours=0.8,
        failure_mode="overtopping"
    )
    assert res["peak_discharge_cms"] > 500.0
    assert res["breach_width_m"] == 120.0
    assert res["breach_time_hours"] == 0.8

def test_hydrograph_generator():
    res = HydrographGenerator.generate(
        peak_discharge_cms=4500.0,
        breach_time_hours=1.0,
        base_inflow_cms=150.0,
        duration_hours=24.0
    )
    assert len(res["time_series"]) > 0
    assert res["peak_discharge_cms"] == 4500.0
    assert res["total_released_volume_mcm"] > 0.0

def test_flood_propagation():
    engine = FloodPropagationModel()
    river_path = [[30.4952, 79.6247], [30.4810, 79.5980], [30.3400, 79.3300]]
    nodes = [{"name": "Check1", "distanceKm": 5.0, "population": 1000, "coords": [30.4810, 79.5980]}]
    
    res = engine.propagate(
        peak_discharge_cms=3000.0,
        current_time_hours=2.0,
        river_path_coords=river_path,
        downstream_nodes=nodes
    )
    assert "nodes" in res
    assert len(res["inundation_polygon"]) > 0

def test_impact_metrics():
    nodes = [{
        "name": "Check1",
        "distanceKm": 5.0,
        "population": 1000,
        "timeOfArrivalHours": 0.5,
        "currentDepthM": 3.2
    }]
    impact = ImpactMetricsCalculator.calculate_impact(
        nodes_state=nodes,
        current_time_hours=2.0,
        peak_discharge_cms=3000.0,
        total_released_mcm=50.0
    )
    assert impact["population_at_risk"] == 1000
    assert impact["affected_settlements_count"] == 1
