'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRESET_SCENARIOS } from '@/lib/api';
import { Scenario } from '@/types';
import { Layers, Plus, Play, Copy, Trash2, Edit, Layers3 } from 'lucide-react';

export default function ScenariosPage() {
  const [scenariosList, setScenariosList] = useState<Scenario[]>(() => Object.values(PRESET_SCENARIOS));

  const handleDuplicate = (sc: Scenario) => {
    const copy: Scenario = {
      ...sc,
      id: `${sc.id}-copy-${Date.now()}`,
      name: `${sc.name} (Duplicate)`,
      breach_width_m: Math.round(sc.breach_width_m * 1.3)
    };
    setScenariosList([copy, ...scenariosList]);
  };

  const handleDelete = (id: string) => {
    setScenariosList(scenariosList.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              SCENARIO MANAGEMENT
            </span>
          </div>
          <h1 className="text-2xl font-black text-white font-mono tracking-tight">
            Dam Breach & Surge Scenarios
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Create, duplicate, edit, and compare hydrological breach scenarios across India’s river basins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/compare"
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
          >
            <Layers3 className="w-4 h-4 text-cyan-400" />
            Scenario Comparison Workspace
          </Link>
        </div>
      </div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenariosList.map((sc) => (
          <div key={sc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-semibold">
                  {sc.failure_mode.toUpperCase()}
                </span>
                <span className="text-slate-400">{sc.dam_name}</span>
              </div>

              <h3 className="font-bold text-base text-white mb-2">{sc.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{sc.description}</p>

              {/* Scenario Param Summary */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4">
                <div>
                  <span className="text-slate-500 block text-[10px]">DAM HEIGHT</span>
                  <span className="text-white font-bold">{sc.dam_height_m} m</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">STORAGE VOL</span>
                  <span className="text-white font-bold">{sc.storage_volume_mcm} MCM</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">BREACH WIDTH</span>
                  <span className="text-amber-400 font-bold">{sc.breach_width_m} m</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">FORMATION TIME</span>
                  <span className="text-amber-400 font-bold">{sc.breach_time_hours} h</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <Link
                href="/simulation"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Scenario
              </Link>
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  onClick={() => handleDuplicate(sc)}
                  className="p-2 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                  title="Duplicate Scenario"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(sc.id)}
                  className="p-2 hover:bg-slate-800 hover:text-rose-400 rounded-lg transition-colors"
                  title="Delete Scenario"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
