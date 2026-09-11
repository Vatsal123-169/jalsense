'use client';

import React from 'react';
import Link from 'next/link';
import { Play, ArrowRight, ShieldAlert, Waves, Layers, Cpu, Eye, FileText, CheckCircle2, AlertOctagon, Activity } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950/80 to-slate-950 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            {/* SIH Tag */}
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Smart India Hackathon 2026 • Problem Statement 26161
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 font-mono">
              FLOOD<span className="text-cyan-400">SIM</span>
            </h1>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-200 mb-4 tracking-wide">
              Simulate. Visualize. Prepare.
            </h2>

            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              An integrated geospatial decision-support platform for dam-break hydrodynamics, downstream wave propagation, and flood inundation risk management.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/simulation"
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current" />
                Launch Simulation
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                Explore Command Center
              </Link>
            </div>
          </div>

          {/* Hero GIS Interactive Preview Visual */}
          <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative group">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-mono text-slate-400 ml-2">FLOODSIM GIS Command Visualiser v1.0</span>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950 border border-cyan-800 px-2.5 py-0.5 rounded">
                LIVE DEMO PREVIEW
              </span>
            </div>

            <div className="relative h-[380px] bg-slate-950 overflow-hidden flex items-center justify-center">
              {/* Simulated Map Visual Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              
              {/* Curved river channel svg */}
              <svg className="absolute inset-0 w-full h-full stroke-cyan-400/40 fill-none" strokeWidth="4">
                <path d="M 100 80 Q 250 150 400 120 T 700 240 T 900 320" strokeDasharray="6 6" />
                {/* Dynamic flood wave expansion corridor */}
                <path d="M 100 80 Q 250 150 400 120 T 700 240 T 900 320" stroke="#ff3b5c" strokeWidth="38" opacity="0.3" strokeLinecap="round" />
                <path d="M 100 80 Q 250 150 400 120 T 700 240 T 900 320" stroke="#ff3b5c" strokeWidth="18" opacity="0.7" strokeLinecap="round" />
              </svg>

              {/* Dam breach marker */}
              <div className="absolute top-[75px] left-[95px] flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-white font-extrabold text-xs shadow-lg shadow-rose-500/50 animate-bounce">
                  ⚡
                </div>
                <span className="text-[10px] font-mono text-rose-400 font-bold bg-slate-950/90 px-2 py-0.5 rounded border border-rose-500/40 mt-1">
                  BREACH: Rishi Ganga Dam
                </span>
              </div>

              {/* Settlement risk markers */}
              <div className="absolute top-[135px] left-[390px] bg-slate-950/90 border border-amber-500/40 p-2 rounded-lg text-xs font-mono">
                <div className="text-amber-400 font-bold">📍 Raini Village</div>
                <div className="text-[10px] text-slate-400">ETA: T+0.8h | Depth: 8.5m</div>
              </div>

              <div className="absolute top-[230px] left-[680px] bg-slate-950/90 border border-cyan-500/40 p-2 rounded-lg text-xs font-mono">
                <div className="text-cyan-400 font-bold">📍 Chamoli District HQ</div>
                <div className="text-[10px] text-slate-400">ETA: T+3.8h | Depth: 1.8m</div>
              </div>

              {/* Impact overlay badge */}
              <div className="absolute bottom-6 right-6 bg-slate-950/95 border border-slate-800 p-4 rounded-xl backdrop-blur-md shadow-2xl max-w-xs text-left">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Simulated Outflow</div>
                <div className="text-2xl font-black text-cyan-400 font-mono">4,850 m³/s</div>
                <div className="text-xs text-slate-300 mt-1">Peak Outflow | PAR: <span className="text-emerald-400 font-bold">46,700</span> people</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">The Challenge</h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              Sudden dam failures, glacial lake outbursts (GLOF), and extreme precipitation cause catastrophic downstream surges within minutes.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Disaster management authorities lack rapid, interactive geospatial tools to instantly evaluate breach hydrographs, inundation arrival times, and population risks across alternative failure scenarios.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Solution: FLOODSIM</h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              FLOODSIM integrates empirical dam breach physics (Froehlich, MacDonald) with 1D/2D hydraulic wave propagation into a unified decision-support dashboard.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Enables authorities to model reservoir drainage, plot outflow hydrographs, track flood wave travel times, compare breach scenarios, and export GIS reports.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Workflow Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-3">How FLOODSIM Works</h2>
          <p className="text-slate-400 text-sm">End-to-end scientific workflow from data input to disaster decision support</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {[
            { step: '01', name: 'DATA', desc: 'DEM & River Paths' },
            { step: '02', name: 'SCENARIO', desc: 'Dam & Breach Params' },
            { step: '03', name: 'BREACH', desc: 'Froehlich Geometry' },
            { step: '04', name: 'HYDROGRAPH', desc: 'Outflow Q(t) Curve' },
            { step: '05', name: 'PROPAGATION', desc: 'Wave Speed & Depth' },
            { step: '06', name: 'INUNDATION', desc: 'Spatial GIS Corridor' },
            { step: '07', name: 'IMPACT', desc: 'PAR & Settlements' },
            { step: '08', name: 'EXPORT', desc: 'GeoJSON & Reports' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center relative group hover:border-cyan-500/50 transition-colors">
              <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">{item.step}</div>
              <div className="font-bold text-xs text-white tracking-wider mb-1">{item.name}</div>
              <div className="text-[10px] text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-3">Key Platform Capabilities</h2>
          <p className="text-slate-400 text-sm">Comprehensive disaster decision-support tooling</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Dam Breach Modeling', desc: 'Froehlich 2008 & MacDonald empirical calculations for breach width, formation time, and peak outflow discharge.', icon: Waves },
            { title: 'Dynamic GIS Flood Mapping', desc: 'Interactive Leaflet GIS map with dam breach markers, hydro-channels, dynamic flood corridor polygons, and settlement risk pins.', icon: Layers },
            { title: 'Scenario Comparison Engine', desc: 'Side-by-side comparative analysis of moderate vs extreme breach scenarios with spatial difference metrics.', icon: ArrowRight },
            { title: 'Hydrograph & Depth Profile', desc: 'Dynamic time-series charts of outflow discharge Q(t) and downstream water depth & velocity attenuation.', icon: Activity },
            { title: 'Population at Risk (PAR)', desc: 'Automated impact metrics estimating submerged towns, affected population, max depth, and earliest wave ETA.', icon: ShieldAlert },
            { title: 'Multi-Format Export Center', desc: 'Generate downloadable GeoJSON spatial layers, CSV time-series hydrographs, KML layers, and PDF summary reports.', icon: FileText }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-lg text-white mb-2">{card.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scientific Honesty Notice Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/90 border border-cyan-500/30 p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-cyan-500/10 px-4 py-1.5 rounded-bl-xl border-b border-l border-cyan-500/30 font-mono text-xs text-cyan-400 font-semibold">
            Scientific Honesty Standard
          </div>

          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            Model Classification & Development Roadmap
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-cyan-400 mb-2 font-mono">CURRENT MVP PROTOTYPE</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Uses empirical breach formulas (Froehlich 2008) + 1D/2D shallow water wave attenuation for rapid interactive decision support. Clearly designated as <span className="text-cyan-300 font-semibold">"Prototype Decision-Support Model"</span>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-emerald-400 mb-2 font-mono">PRODUCTION ENGINE ROADMAP</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Architecture is engineered as <span className="text-emerald-300 font-semibold">"Hydrodynamic Solver Integration Ready"</span> to seamlessly plug into validated 2D hydrodynamic solvers such as SPH / Delft3D.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
