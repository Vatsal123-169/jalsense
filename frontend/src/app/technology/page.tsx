'use client';

import React from 'react';
import { Cpu, CheckCircle2, Layers, Server, Database, Code2 } from 'lucide-react';

export default function TechnologyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            TECHNOLOGY ARCHITECTURE
          </span>
        </div>
        <h1 className="text-3xl font-black text-white font-mono tracking-tight">
          Technology Stack & Hydrodynamic Solver Integration Roadmap
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Modern full-stack technical stack engineered for disaster decision support.
        </p>
      </div>

      {/* Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frontend */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
            <Code2 className="w-5 h-5" />
            Frontend Tier
          </div>
          <ul className="space-y-2 text-xs text-slate-300 font-mono">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Next.js (App Router, TypeScript)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Tailwind CSS (Command-center UI)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Leaflet GIS / MapLibre GL JS</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Recharts (Outflow & Depth Curves)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Lucide Icons</li>
          </ul>
        </div>

        {/* Backend */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
            <Server className="w-5 h-5" />
            Backend API Tier
          </div>
          <ul className="space-y-2 text-xs text-slate-300 font-mono">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Python FastAPI Engine</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pydantic Schema Validation</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> SQLAlchemy ORM Layer</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> PostGIS / SQLite Database</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Async Job Runner Queue</li>
          </ul>
        </div>
      </div>

      {/* Solver Roadmap */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-lg text-white font-mono">Production Hydrodynamic Solver Integration Plan</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          While the MVP prototype runs empirical breach calculations for instant responsiveness, the system backend is structured with clean service interfaces to plug into validated solver engines:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-cyan-400 font-bold mb-1">SPH Solver Engine</div>
            <div className="text-slate-400">Smoothed Particle Hydrodynamics for free-surface turbulent dam break shock waves.</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-amber-400 font-bold mb-1">Delft3D / HEC-RAS 2D</div>
            <div className="text-slate-400">2D shallow water equation (SWE) solvers on unstructured terrain meshes.</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-emerald-400 font-bold mb-1">Google Earth Engine</div>
            <div className="text-slate-400">Satellite-derived SAR water mask cross-validation pipeline.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
