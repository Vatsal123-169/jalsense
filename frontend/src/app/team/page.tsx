'use client';

import React from 'react';
import { Users, Award, ShieldAlert, Code2, Globe } from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            SIH 2026 TEAM CREDITS
          </span>
        </div>
        <h1 className="text-3xl font-black text-white font-mono tracking-tight">
          Smart India Hackathon 2026 • Problem Statement 26161
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          FLOODSIM: Hydrodynamic Flood Simulation & Inundation Decision-Support Platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono">
            LEAD
          </div>
          <h3 className="font-bold text-lg text-white">Full-Stack & Simulation Architect</h3>
          <p className="text-xs text-slate-400">Lead Full-Stack Engineer, GIS Engineer & Hydrodynamic Modeler</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono">
            GIS
          </div>
          <h3 className="font-bold text-lg text-white">Geospatial & Remote Sensing Specialist</h3>
          <p className="text-xs text-slate-400">DEM Processing, River Channel Vectorization & GEE Satellite Masks</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono">
            UI/UX
          </div>
          <h3 className="font-bold text-lg text-white">UI/UX & Disaster Command Designer</h3>
          <p className="text-xs text-slate-400">Command Center Dashboard, Recharts Visualizer & Decision Workflows</p>
        </div>
      </div>
    </div>
  );
}
