export interface DownstreamNode {
  name: string;
  distanceKm: number;
  population: number;
  coords: [number, number];
  timeOfArrivalHours: number;
  currentDepthM: number;
  currentVelocityMS: number;
  status: 'SAFE' | 'ALERT' | 'MODERATE' | 'HIGH RISK' | 'EXTREME DANGER';
}

export interface Scenario {
  id: string;
  name: string;
  description?: string;
  dam_name: string;
  dam_coords: [number, number];
  dam_height_m: number;
  storage_volume_mcm: number;
  breach_width_m: number;
  breach_depth_m?: number;
  breach_time_hours: number;
  inflow_cms: number;
  failure_mode: 'overtopping' | 'piping';
  river_path: Array<[number, number]>;
  downstream_nodes: DownstreamNode[];
}

export interface HydrographPoint {
  time_hours: number;
  discharge_cms: number;
}

export interface SimulationResult {
  simulation_id: string;
  hydrograph: {
    time_series: HydrographPoint[];
    peak_discharge_cms: number;
    time_to_peak_hours: number;
    total_released_volume_mcm: number;
  };
  reservoir_trajectory: Array<{
    time_hours: number;
    volume_mcm: number;
    water_level_m: number;
    discharge_cms: number;
  }>;
  propagation: {
    current_time_hours: number;
    nodes: DownstreamNode[];
    max_water_depth_m: number;
    inundation_polygon: Array<[number, number]>;
  };
  impact_metrics: {
    population_at_risk: number;
    affected_settlements_count: number;
    total_settlements_monitored: number;
    inundated_area_sqkm: number;
    maximum_water_depth_m: number;
    earliest_arrival_hours: number;
    peak_discharge_cms: number;
    total_released_volume_mcm: number;
    overall_risk_level: string;
  };
}

export interface DatasetItem {
  id: string;
  name: string;
  data_type: 'DEM' | 'River' | 'Dam' | 'Satellite' | 'LandUse';
  format: string;
  size_mb: number;
  status: string;
  uploaded_at?: string;
}
