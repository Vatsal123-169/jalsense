'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRESET_SCENARIOS, calculateLocalSimulation } from '@/lib/api';
import { ImpactMetrics } from '@/components/metrics/ImpactMetrics';
import { MapViewer } from '@/components/gis/MapViewer';
import { HydrographChart } from '@/components/charts/HydrographChart';
import { Play, Layers, Bell } from 'lucide-react';

export default function DashboardPage() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('rishiganga');
  const scenario = PRESET_SCENARIOS[selectedScenarioKey];

  const [simResult, setSimResult] = useState(() => {
    return calculateLocalSimulation(scenario, {
      dam_height_m: scenario.dam_height_m,
      storage_volume_mcm: scenario.storage_volume_mcm,
      breach_width_m: scenario.breach_width_m,
      breach_time_hours: scenario.breach_time_hours,
      inflow_cms: scenario.inflow_cms,
      failure_mode: scenario.failure_mode,
      current_time_hours: 6.0
    });
  });

  const handleSelectScenario = (key: string) => {
    setSelectedScenarioKey(key);
    const sc = PRESET_SCENARIOS[key];
    const res = calculateLocalSimulation(sc, {
      dam_height_m: sc.dam_height_m,
      storage_volume_mcm: sc.storage_volume_mcm,
      breach_width_m: sc.breach_width_m,
      breach_time_hours: sc.breach_time_hours,
      inflow_cms: sc.inflow_cms,
      failure_mode: sc.failure_mode,
      current_time_hours: 6.0
    });
    setSimResult(res);
  };

  const handleBroadcastAlert = () => {
    alert(`DEMO ADVISORY PREVIEW\n\nEvent: Dam-breach flood surge\nDam: ${scenario.dam_name}\nPeak discharge: ${simResult.impact_metrics.peak_discharge_cms} m³/s\nPopulation at risk: ${simResult.impact_metrics.population_at_risk.toLocaleString()}\n\nThis preview does not notify emergency services or transmit a CAP alert.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              COMMAND CENTER • SYSTEM READY
            </span>
          </div>
          <h1 className="text-2xl font-black text-white font-mono tracking-tight">
            FLOODSIM Disaster Operations Dashboard
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time hydrodynamic simulation oversight, scenario telemetry, and early warning dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBroadcastAlert}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all"
          >
            <Bell className="w-4 h-4" />
            Preview Advisory
          </button>
          <Link
            href="/simulation"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Open Workspace
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <ImpactMetrics
        peakDischarge={simResult.impact_metrics.peak_discharge_cms}
        maxDepth={simResult.impact_metrics.maximum_water_depth_m}
        inundatedArea={simResult.impact_metrics.inundated_area_sqkm}
        populationAtRisk={simResult.impact_metrics.population_at_risk}
        affectedSettlements={simResult.impact_metrics.affected_settlements_count}
        totalSettlements={simResult.impact_metrics.total_settlements_monitored}
        earliestArrival={simResult.impact_metrics.earliest_arrival_hours}
      />

      {/* Main Grid: Active Map Visual + Hydrograph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: GIS Map Visualizer */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Active Scenario GIS Inundation Map
              </h3>
              <p className="text-xs text-slate-400">{scenario.name}</p>
            </div>

            {/* Scenario Quick Selector Buttons */}
            <div className="flex items-center gap-1">
              {Object.keys(PRESET_SCENARIOS).map((key) => (
                <button
                  key={key}
                  onClick={() => handleSelectScenario(key)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all border ${
                    selectedScenarioKey === key
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {key.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <MapViewer
            scenario={scenario}
            currentTimeHours={6.0}
            inundationPolygon={simResult.propagation.inundation_polygon}
            updatedNodes={simResult.propagation.nodes}
            className="h-[380px] w-full rounded-xl overflow-hidden"
          />
        </div>

        {/* Right 1 Col: Hydrograph & Active Scenario Details */}
        <div className="space-y-6">
          <HydrographChart
            dataPoints={simResult.hydrograph.time_series}
            peakDischarge={simResult.hydrograph.peak_discharge_cms}
            timeToPeak={simResult.hydrograph.time_to_peak_hours}
            totalVolumeMCM={simResult.hydrograph.total_released_volume_mcm}
          />

          {/* Settlement Risk Status Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Downstream Checkpoints</span>
              <span className="text-cyan-400 font-mono text-[10px]">T+6.0h Status</span>
            </h4>
            <div className="space-y-2">
              {simResult.propagation.nodes.map((node, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="font-bold text-white">{node.name}</div>
                    <div className="text-[10px] text-slate-400">{node.distanceKm} km • ETA: T+{node.timeOfArrivalHours}h</div>
                  </div>
                  <div className="text-right">
                    <div className="text-rose-400 font-bold">{node.currentDepthM} m</div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                      node.status === 'EXTREME DANGER' ? 'bg-rose-500/20 text-rose-400' :
                      node.status === 'HIGH RISK' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
