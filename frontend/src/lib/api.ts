import { Scenario, SimulationResult, DatasetItem } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchHealthStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend API offline, falling back to Demo Mode client simulation engine.');
  }
  return {
    status: 'HEALTHY',
    system: 'FLOODSIM Decision-Support Platform',
    mode: 'DEMO MODE',
    sih_problem: '26161',
    solver_readiness: 'Hydrodynamic Solver Integration Ready (SPH / Delft3D)'
  };
}

export const PRESET_SCENARIOS: Record<string, Scenario> = {
  rishiganga: {
    id: 'rishiganga',
    name: 'Rishi Ganga River Outburst (Uttarakhand)',
    description: 'Sudden outburst flood along Dhauliganga & Rishi Ganga hydro-cascade',
    dam_name: 'Tapovan-Vishnugad Barrage',
    dam_coords: [30.4952, 79.6247],
    dam_height_m: 48.0,
    storage_volume_mcm: 65.0,
    breach_width_m: 120.0,
    breach_time_hours: 0.8,
    inflow_cms: 200.0,
    failure_mode: 'overtopping',
    river_path: [
      [30.4952, 79.6247],
      [30.4810, 79.5980],
      [30.4650, 79.5630],
      [30.4420, 79.5100],
      [30.4180, 79.4600],
      [30.3800, 79.3900],
      [30.3400, 79.3300]
    ],
    downstream_nodes: [
      { name: 'Tapovan Hydro Barrage', distanceKm: 4.5, population: 450, coords: [30.4810, 79.5980], timeOfArrivalHours: 0.35, currentDepthM: 12.4, currentVelocityMS: 11.2, status: 'EXTREME DANGER' },
      { name: 'Raini Chakta Village', distanceKm: 11.2, population: 1850, coords: [30.4650, 79.5630], timeOfArrivalHours: 0.88, currentDepthM: 8.5, currentVelocityMS: 9.1, status: 'EXTREME DANGER' },
      { name: 'Joshimath Lower Ridge', distanceKm: 22.8, population: 12400, coords: [30.4180, 79.4600], timeOfArrivalHours: 1.82, currentDepthM: 4.2, currentVelocityMS: 6.5, status: 'HIGH RISK' },
      { name: 'Chamoli District HQ', distanceKm: 48.0, population: 32000, coords: [30.3400, 79.3300], timeOfArrivalHours: 3.84, currentDepthM: 1.8, currentVelocityMS: 3.8, status: 'MODERATE' }
    ]
  },
  teesta: {
    id: 'teesta',
    name: 'Teesta Stage-III Dam Breach (Sikkim)',
    description: 'Glacial Lake Outburst Flood (GLOF) surge in North Sikkim',
    dam_name: 'Chungthang Hydro Dam',
    dam_coords: [27.6042, 88.6475],
    dam_height_m: 60.0,
    storage_volume_mcm: 145.0,
    breach_width_m: 160.0,
    breach_time_hours: 1.2,
    inflow_cms: 350.0,
    failure_mode: 'overtopping',
    river_path: [
      [27.6042, 88.6475],
      [27.5180, 88.5420],
      [27.3820, 88.5080],
      [27.2340, 88.4720],
      [27.1750, 88.5320]
    ],
    downstream_nodes: [
      { name: 'Chungthang Powerhouse', distanceKm: 3.2, population: 820, coords: [27.5840, 88.6120], timeOfArrivalHours: 0.25, currentDepthM: 14.8, currentVelocityMS: 12.0, status: 'EXTREME DANGER' },
      { name: 'Mangan Township', distanceKm: 18.5, population: 8600, coords: [27.5180, 88.5420], timeOfArrivalHours: 1.48, currentDepthM: 6.8, currentVelocityMS: 7.8, status: 'EXTREME DANGER' },
      { name: 'Singtam Highway Bridge', distanceKm: 38.0, population: 19500, coords: [27.2340, 88.4720], timeOfArrivalHours: 3.04, currentDepthM: 3.4, currentVelocityMS: 5.2, status: 'HIGH RISK' },
      { name: 'Rangpo Border Hub', distanceKm: 54.2, population: 28000, coords: [27.1750, 88.5320], timeOfArrivalHours: 4.33, currentDepthM: 1.5, currentVelocityMS: 3.2, status: 'MODERATE' }
    ]
  },
  bhakra: {
    id: 'bhakra',
    name: 'Bhakra Extreme PMF Breach (Himachal)',
    description: 'Probable Maximum Flood (PMF) overtopping scenario',
    dam_name: 'Bhakra High Gravity Dam',
    dam_coords: [31.4116, 76.4358],
    dam_height_m: 226.0,
    storage_volume_mcm: 9620.0,
    breach_width_m: 420.0,
    breach_time_hours: 2.8,
    inflow_cms: 1200.0,
    failure_mode: 'overtopping',
    river_path: [
      [31.4116, 76.4358],
      [31.3700, 76.3800],
      [31.2300, 76.5000],
      [31.1000, 76.5200]
    ],
    downstream_nodes: [
      { name: 'Nangal Hydel Barrage', distanceKm: 9.8, population: 14500, coords: [31.3700, 76.3800], timeOfArrivalHours: 0.78, currentDepthM: 18.2, currentVelocityMS: 13.5, status: 'EXTREME DANGER' },
      { name: 'Anandpur Sahib Basin', distanceKm: 27.5, population: 42000, coords: [31.2300, 76.5000], timeOfArrivalHours: 2.20, currentDepthM: 9.4, currentVelocityMS: 8.8, status: 'EXTREME DANGER' },
      { name: 'Ropar Headworks', distanceKm: 48.0, population: 78000, coords: [31.1000, 76.5200], timeOfArrivalHours: 3.84, currentDepthM: 4.8, currentVelocityMS: 5.5, status: 'HIGH RISK' }
    ]
  }
};

export function calculateLocalSimulation(
  scenario: Scenario,
  params: {
    dam_height_m: number;
    storage_volume_mcm: number;
    breach_width_m: number;
    breach_time_hours: number;
    inflow_cms: number;
    failure_mode: string;
    current_time_hours: number;
  }
): SimulationResult {
  const H = params.dam_height_m;
  const V_m3 = params.storage_volume_mcm * 1e6;
  const mode = params.failure_mode;
  
  // Froehlich Q_peak
  const Ko = mode === 'overtopping' ? 1.3 : 1.0;
  let raw_Q_peak = 0.607 * Math.pow(V_m3, 0.295) * Math.pow(H, 1.24);
  if (mode === 'piping') raw_Q_peak *= 0.85;
  const Q_peak = Math.round(raw_Q_peak + params.inflow_cms);

  // Hydrograph time series
  const timeSeries = [];
  const t_peak = Math.max(0.1, params.breach_time_hours);
  let total_vol_m3 = 0;

  for (let t = 0; t <= 24; t += 0.5) {
    let q = params.inflow_cms;
    if (t <= t_peak) {
      q += (Q_peak - params.inflow_cms) * Math.pow(t / t_peak, 2);
    } else {
      const decay = 0.25 / t_peak;
      q += (Q_peak - params.inflow_cms) * Math.exp(-decay * (t - t_peak));
    }
    timeSeries.push({ time_hours: t, discharge_cms: Math.round(q) });
    total_vol_m3 += q * 1800;
  }

  // Calculate updated node arrival & depths at current_time_hours
  const currentTime = params.current_time_hours;
  let totalPAR = 0;
  let submergedCount = 0;
  let maxDepth = 0;
  let earliestArrival = 999;

  const updatedNodes = scenario.downstream_nodes.map(node => {
    const waveSpeed = Math.max(4, 12 - node.distanceKm * 0.12);
    const toa = parseFloat((node.distanceKm / (waveSpeed * 3.6)).toFixed(2));
    if (toa < earliestArrival) earliestArrival = toa;

    let depth = 0;
    let vel = 0;
    let status: DownstreamNode['status'] = 'SAFE';

    if (currentTime >= toa) {
      const timeSince = currentTime - toa;
      const initialDepth = Math.min(22, 10 + Q_peak / 1000);
      const maxNodeDepth = Math.max(0.8, initialDepth * Math.pow(10 / (node.distanceKm + 10), 0.6));

      if (timeSince <= 3) {
        depth = maxNodeDepth * (timeSince / 3);
      } else {
        depth = maxNodeDepth * Math.exp(-0.15 * (timeSince - 3));
      }
      vel = Math.min(14, Math.sqrt(9.81 * Math.max(0.1, depth)) * 1.2);

      if (depth > 5) status = 'EXTREME DANGER';
      else if (depth > 2) status = 'HIGH RISK';
      else if (depth > 0.5) status = 'MODERATE';
      else status = 'ALERT';

      totalPAR += node.population;
      submergedCount++;
      if (depth > maxDepth) maxDepth = depth;
    }

    return {
      ...node,
      timeOfArrivalHours: toa,
      currentDepthM: parseFloat(depth.toFixed(2)),
      currentVelocityMS: parseFloat(vel.toFixed(2)),
      status
    };
  });

  // Calculate Spatial Inundation Polygon
  const polyCoords: Array<[number, number]> = [];
  if (currentTime > 0 && scenario.riverPath.length > 1) {
    const maxReachKm = currentTime * 18;
    const flooded: Array<[number, number]> = [scenario.riverPath[0]];
    let accum = 0;

    for (let i = 1; i < scenario.riverPath.length; i++) {
      const p1 = scenario.riverPath[i - 1];
      const p2 = scenario.riverPath[i];
      const segKm = Math.sqrt(Math.pow((p2[0] - p1[0]) * 111, 2) + Math.pow((p2[1] - p1[1]) * 111, 2));

      if (accum + segKm <= maxReachKm) {
        flooded.push(p2);
        accum += segKm;
      } else {
        const ratio = (maxReachKm - accum) / (segKm || 1);
        flooded.push([p1[0] + (p2[0] - p1[0]) * ratio, p1[1] + (p2[1] - p1[1]) * ratio]);
        break;
      }
    }

    const left: Array<[number, number]> = [];
    const right: Array<[number, number]> = [];
    const widthScale = Math.min(3.5, 1.0 + Q_peak / 4000);

    flooded.forEach((pt, idx) => {
      const spread = Math.max(0.004, 0.025 * widthScale - idx * 0.0015);
      left.push([parseFloat((pt[0] + spread).toFixed(5)), parseFloat((pt[1] - spread * 0.8).toFixed(5))]);
      right.unshift([parseFloat((pt[0] - spread).toFixed(5)), parseFloat((pt[1] + spread * 0.8).toFixed(5))]);
    });
    polyCoords.push(...left, ...right);
  }

  const inundatedAreaSqKm = parseFloat((Math.min(280, currentTime * 3.4 * (Q_peak / 4500))).toFixed(1));

  return {
    simulation_id: `sim-demo-${Date.now()}`,
    hydrograph: {
      time_series: timeSeries,
      peak_discharge_cms: Q_peak,
      time_to_peak_hours: t_peak,
      total_released_volume_mcm: parseFloat((total_vol_m3 / 1e6).toFixed(2))
    },
    reservoir_trajectory: [],
    propagation: {
      current_time_hours: currentTime,
      nodes: updatedNodes,
      max_water_depth_m: parseFloat(maxDepth.toFixed(2)),
      inundation_polygon: polyCoords
    },
    impact_metrics: {
      population_at_risk: totalPAR,
      affected_settlements_count: submergedCount,
      total_settlements_monitored: scenario.downstream_nodes.length,
      inundated_area_sqkm: inundatedAreaSqKm,
      maximum_water_depth_m: parseFloat(maxDepth.toFixed(2)),
      earliest_arrival_hours: earliestArrival === 999 ? 0 : earliestArrival,
      peak_discharge_cms: Q_peak,
      total_released_volume_mcm: parseFloat((total_vol_m3 / 1e6).toFixed(2)),
      overall_risk_level: submergedCount >= 3 ? 'CRITICAL / SEVERE' : submergedCount >= 1 ? 'MODERATE / HIGH' : 'LOW'
    }
  };
}
