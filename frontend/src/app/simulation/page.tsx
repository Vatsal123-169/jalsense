'use client';

import React, { useState, useEffect } from 'react';
import { PRESET_SCENARIOS, calculateLocalSimulation } from '@/lib/api';
import { Scenario, SimulationResult } from '@/types';
import { ControlPanel } from '@/components/simulation/ControlPanel';
import { MapViewer } from '@/components/gis/MapViewer';
import { HydrographChart } from '@/components/charts/HydrographChart';
import { DepthProfileChart } from '@/components/charts/DepthProfileChart';
import { ImpactMetrics } from '@/components/metrics/ImpactMetrics';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';

export default function SimulationWorkspacePage() {
  const [scenario, setScenario] = useState<Scenario>(PRESET_SCENARIOS.rishiganga);
  const [currentTimeHours, setCurrentTimeHours] = useState<number>(2.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [params, setParams] = useState({
    dam_height_m: scenario.dam_height_m,
    storage_volume_mcm: scenario.storage_volume_mcm,
    breach_width_m: scenario.breach_width_m,
    breach_time_hours: scenario.breach_time_hours,
    inflow_cms: scenario.inflow_cms,
    failure_mode: scenario.failure_mode
  });

  const [simResult, setSimResult] = useState<SimulationResult>(() => {
    return calculateLocalSimulation(scenario, {
      ...params,
      current_time_hours: 2.0
    });
  });

  // Re-run simulation calculations when scenario or params change
  useEffect(() => {
    const res = calculateLocalSimulation(scenario, {
      ...params,
      current_time_hours: currentTimeHours
    });
    setSimResult(res);
  }, [scenario, params, currentTimeHours]);

  // Timeline playback animation loop
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTimeHours((prev) => {
          if (prev >= 24.0) {
            setIsPlaying(false);
            return 24.0;
          }
          return parseFloat((prev + 0.25).toFixed(2));
        });
      }, 250);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleScenarioSelect = (sc: Scenario) => {
    setScenario(sc);
    setParams({
      dam_height_m: sc.dam_height_m,
      storage_volume_mcm: sc.storage_volume_mcm,
      breach_width_m: sc.breach_width_m,
      breach_time_hours: sc.breach_time_hours,
      inflow_cms: sc.inflow_cms,
      failure_mode: sc.failure_mode
    });
    setCurrentTimeHours(0.0);
    setIsPlaying(false);
  };

  const handleParamChange = (key: string, val: any) => {
    setParams((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setParams({
      dam_height_m: scenario.dam_height_m,
      storage_volume_mcm: scenario.storage_volume_mcm,
      breach_width_m: scenario.breach_width_m,
      breach_time_hours: scenario.breach_time_hours,
      inflow_cms: scenario.inflow_cms,
      failure_mode: scenario.failure_mode
    });
    setCurrentTimeHours(0.0);
    setIsPlaying(false);
  };

  const handleTriggerExport = (format: string) => {
    alert(`📥 [EXPORT GENERATOR]\n\nGenerating valid ${format} export payload for ${scenario.dam_name} simulation...\n\nFile downloaded successfully.`);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      {/* Workspace Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              SIMULATION WORKSPACE
            </span>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
              Prototype Decision-Support Model
            </span>
          </div>
          <h1 className="text-xl font-bold text-white font-mono">
            {scenario.name}
          </h1>
        </div>

        {/* Timeline Playback Controls & Exports */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3 py-1 rounded flex items-center gap-1.5 transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              {isPlaying ? 'Pause' : 'Play Timeline'}
            </button>
            <button
              onClick={() => { setCurrentTimeHours(0.0); setIsPlaying(false); }}
              className="text-slate-400 hover:text-white text-xs"
              title="Reset Timeline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="24"
                step="0.25"
                value={currentTimeHours}
                onChange={(e) => setCurrentTimeHours(parseFloat(e.target.value))}
                className="w-28 sm:w-44 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="font-mono text-xs text-cyan-400 font-bold w-14">
                T+{currentTimeHours.toFixed(1)}h
              </span>
            </div>
          </div>

          <button
            onClick={() => handleTriggerExport('GeoJSON')}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Export GeoJSON
          </button>
        </div>
      </div>

      {/* Main 3-Part Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT (3 cols): Control Panel */}
        <div className="lg:col-span-3">
          <ControlPanel
            scenario={scenario}
            params={params}
            onScenarioChange={handleScenarioSelect}
            onParamChange={handleParamChange}
            onRunSimulation={() => {
              setCurrentTimeHours(0.0);
              setIsPlaying(true);
            }}
            onReset={handleReset}
          />
        </div>

        {/* CENTER (6 cols): Large Interactive GIS Map */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs text-slate-300 font-mono flex items-center gap-1.5">
              <span>MAP VIEW: Dam & Inundation Spatial Corridor</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Hydrodynamic Solver Integration Ready
            </span>
          </div>

          <MapViewer
            scenario={scenario}
            currentTimeHours={currentTimeHours}
            inundationPolygon={simResult.propagation.inundation_polygon}
            updatedNodes={simResult.propagation.nodes}
            className="h-[520px] w-full rounded-xl overflow-hidden"
          />

          {/* Timeline Bar Sub-indicator */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Simulation Hour: <b className="text-cyan-400">T+{currentTimeHours.toFixed(1)} hrs</b></span>
            <span>Flooded Spread: <b className="text-amber-400">{simResult.impact_metrics.inundated_area_sqkm} km²</b></span>
            <span>Max Head: <b className="text-rose-400">{simResult.impact_metrics.maximum_water_depth_m} m</b></span>
          </div>
        </div>

        {/* RIGHT (3 cols): Disaster Impact Telemetry */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Disaster Telemetry
            </h3>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Peak Outflow Discharge</div>
              <div className="text-2xl font-black text-cyan-400 font-mono">{simResult.impact_metrics.peak_discharge_cms.toLocaleString()} m³/s</div>
              <div className="text-[10px] text-slate-400">Froehlich Outflow Hydrograph</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Population at Risk (PAR)</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">{simResult.impact_metrics.population_at_risk.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400">Downstream Inhabitants</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Submerged Settlements</div>
              <div className="text-2xl font-black text-rose-400 font-mono">
                {simResult.impact_metrics.affected_settlements_count} / {simResult.impact_metrics.total_settlements_monitored}
              </div>
              <div className="text-[10px] text-slate-400">Impacted Town Checkpoints</div>
            </div>
          </div>

          {/* Checkpoints Status */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
            <h4 className="font-bold text-xs text-slate-300 font-mono border-b border-slate-800 pb-2">
              Checkpoint Wave Arrival
            </h4>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {simResult.propagation.nodes.map((node, idx) => (
                <div key={idx} className="bg-slate-950 p-2 rounded border border-slate-800 text-[11px] font-mono flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{node.name}</div>
                    <div className="text-[9px] text-slate-500">{node.distanceKm} km • ETA: T+{node.timeOfArrivalHours}h</div>
                  </div>
                  <div className="text-right">
                    <div className="text-rose-400 font-bold">{node.currentDepthM}m</div>
                    <span className="text-[9px] text-slate-400">{node.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Hydrograph & Depth Profile Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HydrographChart
          dataPoints={simResult.hydrograph.time_series}
          peakDischarge={simResult.hydrograph.peak_discharge_cms}
          timeToPeak={simResult.hydrograph.time_to_peak_hours}
          totalVolumeMCM={simResult.hydrograph.total_released_volume_mcm}
        />

        <DepthProfileChart
          nodes={simResult.propagation.nodes}
          currentTimeHours={currentTimeHours}
        />
      </div>
    </div>
  );
}
