'use client';

import React, { useState } from 'react';
import { Cpu, Server, Database, Layers, ArrowDown, Activity, Play, Globe } from 'lucide-react';

export default function ArchitecturePage() {
  const [activeComponent, setActiveComponent] = useState<string>('frontend');

  const componentDetails: Record<string, { title: string; tech: string; desc: string }> = {
    frontend: {
      title: 'Frontend Tier (Next.js 14)',
      tech: 'React 18, TypeScript, Tailwind CSS, Leaflet GIS, Recharts',
      desc: 'Interactive 3-part simulation workspace, scenario management, command center dashboard, and multi-format exporter UI.'
    },
    fastapi: {
      title: 'FastAPI Backend API',
      tech: 'Python 3.15, Pydantic v2, CORS, Structured Error Handling',
      desc: 'REST API endpoints serving simulation triggers, scenario updates, comparison matrix, and export downloads.'
    },
    queue: {
      title: 'Job Queue & Worker Runner',
      tech: 'In-Memory Async Job Runner / Redis Celery Hook',
      desc: 'Manages job queue states (QUEUED -> PROCESSING -> COMPLETED) without blocking HTTP responses.'
    },
    physics: {
      title: 'Hydrodynamic Simulation Services',
      tech: 'BreachModel (Froehlich), ReservoirModel, HydrographGenerator, FloodPropagationModel',
      desc: 'Executes empirical breach geometry calculations, differential reservoir drainage, outflow hydrograph generation, and wave travel times.'
    },
    database: {
      title: 'PostGIS / SQLAlchemy Database',
      tech: 'PostgreSQL + PostGIS (SQLite fallback for demo mode)',
      desc: 'Stores dam registry, river polylines, simulation result trajectories, scenario configurations, and export logs.'
    },
    gis: {
      title: 'GIS Processing & Exporter',
      tech: 'GeoJSON FeatureCollection Exporter, KML Generator, CSV Generator',
      desc: 'Constructs spatial inundation buffer polygon geometries along river channels and builds OGC-compliant GIS export payloads.'
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            SYSTEM ARCHITECTURE
          </span>
        </div>
        <h1 className="text-3xl font-black text-white font-mono tracking-tight">
          Interactive Full-Stack Architecture Diagram
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Click any architecture component node below to inspect its sub-system design and responsibilities.
        </p>
      </div>

      {/* Interactive Diagram Flow Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { key: 'frontend', name: 'Next.js Frontend', sub: 'React 18 + Leaflet', color: 'border-cyan-500/50 text-cyan-400' },
          { key: 'fastapi', name: 'FastAPI Backend', sub: 'REST Endpoints & Router', color: 'border-emerald-500/50 text-emerald-400' },
          { key: 'queue', name: 'Job Queue Service', sub: 'Async Worker Manager', color: 'border-amber-500/50 text-amber-400' },
          { key: 'physics', name: 'Hydrodynamic Engine', sub: 'Froehlich & 1D/2D Wave', color: 'border-rose-500/50 text-rose-400' },
          { key: 'database', name: 'PostGIS / Database', sub: 'SQLAlchemy Models', color: 'border-blue-500/50 text-blue-400' },
          { key: 'gis', name: 'GIS Processing & Export', sub: 'GeoJSON & KML Generator', color: 'border-purple-500/50 text-purple-400' }
        ].map((node) => (
          <button
            key={node.key}
            onClick={() => setActiveComponent(node.key)}
            className={`p-5 rounded-2xl text-left border transition-all ${
              activeComponent === node.key
                ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10 scale-105'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className={`font-mono text-xs font-bold mb-1 ${node.color}`}>{node.name}</div>
            <div className="text-[11px] text-slate-400 font-mono">{node.sub}</div>
          </button>
        ))}
      </div>

      {/* Node Inspection Detail Box */}
      {activeComponent && componentDetails[activeComponent] && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-lg text-white font-mono">{componentDetails[activeComponent].title}</h3>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
              Selected Subsystem
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase">Technologies Used</div>
            <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5">{componentDetails[activeComponent].tech}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase mt-2">Functional Responsibility</div>
            <p className="text-xs text-slate-300 leading-relaxed mt-1">{componentDetails[activeComponent].desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}
