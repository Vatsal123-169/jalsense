'use client';

import React from 'react';
import { Users, Waves, ShieldAlert, Clock, Maximize2, AlertTriangle } from 'lucide-react';

interface ImpactMetricsProps {
  peakDischarge: number;
  maxDepth: number;
  inundatedArea: number;
  populationAtRisk: number;
  affectedSettlements: number;
  totalSettlements: number;
  earliestArrival: number;
  overallRiskLevel?: string;
}

export const ImpactMetrics: React.FC<ImpactMetricsProps> = ({
  peakDischarge,
  maxDepth,
  inundatedArea,
  populationAtRisk,
  affectedSettlements,
  totalSettlements,
  earliestArrival,
  overallRiskLevel = 'CRITICAL / SEVERE'
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Metric 1: Peak Discharge */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Peak Discharge</span>
          <Waves className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-xl font-extrabold text-white font-mono">{peakDischarge.toLocaleString()}</div>
        <div className="text-[10px] text-cyan-400 font-mono mt-0.5">m³/s (Peak Outflow)</div>
      </div>

      {/* Metric 2: Max Depth */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Max Water Depth</span>
          <AlertTriangle className="w-4 h-4 text-rose-400" />
        </div>
        <div className="text-xl font-extrabold text-rose-400 font-mono">{maxDepth.toFixed(1)} m</div>
        <div className="text-[10px] text-slate-400 font-mono mt-0.5">Peak Inundation Head</div>
      </div>

      {/* Metric 3: Submerged Area */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Inundated Area</span>
          <Maximize2 className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-xl font-extrabold text-amber-400 font-mono">{inundatedArea} km²</div>
        <div className="text-[10px] text-slate-400 font-mono mt-0.5">Estimated Flood Spread</div>
      </div>

      {/* Metric 4: Population at Risk */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Population (PAR)</span>
          <Users className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-xl font-extrabold text-emerald-400 font-mono">{populationAtRisk.toLocaleString()}</div>
        <div className="text-[10px] text-slate-400 font-mono mt-0.5">People at Risk</div>
      </div>

      {/* Metric 5: Affected Settlements */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Settlements</span>
          <ShieldAlert className="w-4 h-4 text-rose-500" />
        </div>
        <div className="text-xl font-extrabold text-white font-mono">
          {affectedSettlements} <span className="text-xs text-slate-500 font-normal">/ {totalSettlements}</span>
        </div>
        <div className="text-[10px] text-rose-400 font-mono mt-0.5">Submerged Towns</div>
      </div>

      {/* Metric 6: Flood Wave Arrival */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl shadow-md">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Earliest Wave</span>
          <Clock className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-xl font-extrabold text-cyan-400 font-mono">T+{earliestArrival}h</div>
        <div className="text-[10px] text-slate-400 font-mono mt-0.5">First Checkpoint ETA</div>
      </div>
    </div>
  );
};
