'use client';

import React from 'react';
import { Scenario } from '@/types';
import { PRESET_SCENARIOS } from '@/lib/api';
import { Play, RotateCcw, Sliders, Info, Zap } from 'lucide-react';

interface ControlPanelProps {
  scenario: Scenario;
  params: {
    dam_height_m: number;
    storage_volume_mcm: number;
    breach_width_m: number;
    breach_time_hours: number;
    inflow_cms: number;
    failure_mode: string;
  };
  onScenarioChange: (scenario: Scenario) => void;
  onParamChange: (key: string, value: any) => void;
  onRunSimulation: () => void;
  onReset: () => void;
  isSimulating?: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  scenario,
  params,
  onScenarioChange,
  onParamChange,
  onRunSimulation,
  onReset,
  isSimulating = false
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white flex flex-col gap-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-sm text-white">Simulation Parameters</h3>
        </div>
        <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
          Empirical Breach Engine
        </span>
      </div>

      {/* Preset Scenario Selector Buttons */}
      <div>
        <label className="text-xs font-semibold text-slate-300 mb-2 block flex items-center justify-between">
          <span>Preset Dam Scenarios</span>
          <span className="text-[10px] text-slate-400 font-mono">Real-world Basins</span>
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {Object.values(PRESET_SCENARIOS).map((sc) => (
            <button
              key={sc.id}
              onClick={() => onScenarioChange(sc)}
              className={`p-2 rounded-lg text-left text-xs transition-all border ${
                scenario.id === sc.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="font-bold truncate text-[11px]">{sc.dam_name.split(' ')[0]}</div>
              <div className="text-[10px] opacity-75 truncate">{sc.name.split(' ')[0]}</div>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* Slider Controls */}
      <div className="space-y-3">
        {/* Dam Height */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-mono">
            <span className="text-slate-300 flex items-center gap-1">
              Dam Height (H)
              <span className="text-slate-500 text-[10px] font-sans" title="Structural height from crest to toe">(m)</span>
            </span>
            <span className="text-cyan-400 font-bold">{params.dam_height_m} m</span>
          </div>
          <input
            type="range"
            min="10"
            max="300"
            step="1"
            value={params.dam_height_m}
            onChange={(e) => onParamChange('dam_height_m', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Reservoir Storage Volume */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-mono">
            <span className="text-slate-300 flex items-center gap-1">
              Storage Volume (V)
              <span className="text-slate-500 text-[10px] font-sans" title="Total active storage volume">(MCM)</span>
            </span>
            <span className="text-cyan-400 font-bold">{params.storage_volume_mcm} MCM</span>
          </div>
          <input
            type="range"
            min="5"
            max="10000"
            step="5"
            value={params.storage_volume_mcm}
            onChange={(e) => onParamChange('storage_volume_mcm', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Final Breach Width */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-mono">
            <span className="text-slate-300 flex items-center gap-1">
              Final Breach Width (B_w)
              <span className="text-slate-500 text-[10px] font-sans" title="Froehlich calculated top width">(m)</span>
            </span>
            <span className="text-amber-400 font-bold">{params.breach_width_m} m</span>
          </div>
          <input
            type="range"
            min="10"
            max="600"
            step="5"
            value={params.breach_width_m}
            onChange={(e) => onParamChange('breach_width_m', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Breach Formation Time */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-mono">
            <span className="text-slate-300 flex items-center gap-1">
              Formation Time (t_b)
              <span className="text-slate-500 text-[10px] font-sans" title="Time taken for full breach opening">(hrs)</span>
            </span>
            <span className="text-amber-400 font-bold">{params.breach_time_hours} h</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="6.0"
            step="0.1"
            value={params.breach_time_hours}
            onChange={(e) => onParamChange('breach_time_hours', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Base River Inflow */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-mono">
            <span className="text-slate-300 flex items-center gap-1">
              River Inflow (Q_in)
              <span className="text-slate-500 text-[10px] font-sans">(m³/s)</span>
            </span>
            <span className="text-slate-400 font-bold">{params.inflow_cms} m³/s</span>
          </div>
          <input
            type="range"
            min="10"
            max="2000"
            step="25"
            value={params.inflow_cms}
            onChange={(e) => onParamChange('inflow_cms', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-slate-400"
          />
        </div>

        {/* Failure Mode Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Failure Mode Mechanism</label>
          <select
            value={params.failure_mode}
            onChange={(e) => onParamChange('failure_mode', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="overtopping">Overtopping Failure (Ko = 1.3 - Sudden Crest Surge)</option>
            <option value="piping">Piping Failure (Ko = 1.0 - Internal Erosion Tunnel)</option>
          </select>
        </div>
      </div>

      {/* Trigger Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onRunSimulation}
          disabled={isSimulating}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isSimulating ? 'Processing...' : 'Run Simulation'}
        </button>
        <button
          onClick={onReset}
          className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white p-2.5 rounded-lg text-xs transition-colors"
          title="Reset Parameters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
