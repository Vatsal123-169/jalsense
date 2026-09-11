'use client';

import React, { useState } from 'react';
import { PRESET_SCENARIOS, calculateLocalSimulation } from '@/lib/api';
import { Scenario } from '@/types';
import { MapViewer } from '@/components/gis/MapViewer';
import { Layers3, ArrowRight, ShieldAlert, Waves, Maximize2, Users } from 'lucide-react';

export default function ScenarioComparisonPage() {
  const [scenarioA, setScenarioA] = useState<Scenario>(PRESET_SCENARIOS.rishiganga);
  const [scenarioB, setScenarioB] = useState<Scenario>(() => ({
    ...PRESET_SCENARIOS.rishiganga,
    id: 'rishiganga-extreme',
    name: 'Rishi Ganga Extreme PMF Overtopping',
    breach_width_m: 220,
    breach_time_hours: 0.5,
    storage_volume_mcm: 95
  }));

  const simResultA = calculateLocalSimulation(scenarioA, {
    dam_height_m: scenarioA.dam_height_m,
    storage_volume_mcm: scenarioA.storage_volume_mcm,
    breach_width_m: scenarioA.breach_width_m,
    breach_time_hours: scenarioA.breach_time_hours,
    inflow_cms: scenarioA.inflow_cms,
    failure_mode: scenarioA.failure_mode,
    current_time_hours: 6.0
  });

  const simResultB = calculateLocalSimulation(scenarioB, {
    dam_height_m: scenarioB.dam_height_m,
    storage_volume_mcm: scenarioB.storage_volume_mcm,
    breach_width_m: scenarioB.breach_width_m,
    breach_time_hours: scenarioB.breach_time_hours,
    inflow_cms: scenarioB.inflow_cms,
    failure_mode: scenarioB.failure_mode,
    current_time_hours: 6.0
  });

  const qDelta = simResultB.impact_metrics.peak_discharge_cms - simResultA.impact_metrics.peak_discharge_cms;
  const areaDelta = (simResultB.impact_metrics.inundated_area_sqkm - simResultA.impact_metrics.inundated_area_sqkm).toFixed(1);
  const parDelta = simResultB.impact_metrics.population_at_risk - simResultA.impact_metrics.population_at_risk;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers3 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              SCENARIO COMPARISON WORKSPACE
            </span>
          </div>
          <h1 className="text-2xl font-black text-white font-mono tracking-tight">
            Side-by-Side Breach Scenario Analysis
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Evaluate downstream spatial inundation delta, peak discharge variance, and population exposure across alternative failure modes.
          </p>
        </div>
      </div>

      {/* Difference Indicator KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono">
          <div className="text-xs text-slate-400 mb-1 uppercase">Peak Discharge Variance</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-cyan-400">+{qDelta.toLocaleString()} m³/s</span>
            <span className="text-xs text-slate-500">({((qDelta / simResultA.impact_metrics.peak_discharge_cms) * 100).toFixed(0)}% surge)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono">
          <div className="text-xs text-slate-400 mb-1 uppercase">Inundated Area Delta</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">+{areaDelta} km²</span>
            <span className="text-xs text-slate-500">({simResultA.impact_metrics.inundated_area_sqkm} → {simResultB.impact_metrics.inundated_area_sqkm} km²)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl font-mono">
          <div className="text-xs text-slate-400 mb-1 uppercase">Population Risk Exposure Delta</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-400">+{parDelta.toLocaleString()} PAR</span>
            <span className="text-xs text-slate-500">Additional Inhabitants</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side GIS Maps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scenario A Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">SCENARIO A (Moderate)</span>
              <h3 className="font-bold text-sm text-white">{scenarioA.name}</h3>
            </div>
            <span className="text-xs font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
              Width: {scenarioA.breach_width_m}m
            </span>
          </div>

          <MapViewer
            scenario={scenarioA}
            currentTimeHours={6.0}
            inundationPolygon={simResultA.propagation.inundation_polygon}
            updatedNodes={simResultA.propagation.nodes}
            className="h-[340px] w-full rounded-xl overflow-hidden"
          />

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-500 block text-[10px]">Q_PEAK</span>
              <span className="text-cyan-400 font-bold">{simResultA.impact_metrics.peak_discharge_cms.toLocaleString()} m³/s</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">FLOOD AREA</span>
              <span className="text-amber-400 font-bold">{simResultA.impact_metrics.inundated_area_sqkm} km²</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">PAR</span>
              <span className="text-emerald-400 font-bold">{simResultA.impact_metrics.population_at_risk.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Scenario B Card */}
        <div className="bg-slate-900 border border-rose-950/60 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-xs font-mono font-bold text-rose-400 uppercase">SCENARIO B (Severe / Extreme)</span>
              <h3 className="font-bold text-sm text-white">{scenarioB.name}</h3>
            </div>
            <span className="text-xs font-mono bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
              Width: {scenarioB.breach_width_m}m
            </span>
          </div>

          <MapViewer
            scenario={scenarioB}
            currentTimeHours={6.0}
            inundationPolygon={simResultB.propagation.inundation_polygon}
            updatedNodes={simResultB.propagation.nodes}
            className="h-[340px] w-full rounded-xl overflow-hidden"
          />

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-500 block text-[10px]">Q_PEAK</span>
              <span className="text-cyan-400 font-bold">{simResultB.impact_metrics.peak_discharge_cms.toLocaleString()} m³/s</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">FLOOD AREA</span>
              <span className="text-amber-400 font-bold">{simResultB.impact_metrics.inundated_area_sqkm} km²</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">PAR</span>
              <span className="text-rose-400 font-bold">{simResultB.impact_metrics.population_at_risk.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
