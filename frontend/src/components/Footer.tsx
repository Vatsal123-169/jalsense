'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Info, Cpu, Users } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white text-base tracking-wider font-mono">FLOODSIM</span>
          </div>
          <p className="text-slate-400 leading-relaxed mb-4">
            An integrated geospatial decision-support platform for dam-break hydrodynamics and inundation risk mapping.
          </p>
          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-[11px] text-slate-300">
            <span className="text-cyan-400 font-semibold">Smart India Hackathon 2026</span> • Problem Statement 26161
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm tracking-wide">Platform Workspaces</h4>
          <ul className="space-y-2">
            <li><Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Disaster Command Center</Link></li>
            <li><Link href="/simulation" className="hover:text-cyan-400 transition-colors">Simulation Workspace</Link></li>
            <li><Link href="/scenarios" className="hover:text-cyan-400 transition-colors">Scenario Management</Link></li>
            <li><Link href="/compare" className="hover:text-cyan-400 transition-colors">Scenario Comparison</Link></li>
            <li><Link href="/satellite" className="hover:text-cyan-400 transition-colors">Satellite Validation (GEE Ready)</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm tracking-wide">Technical Documentation</h4>
          <ul className="space-y-2">
            <li><Link href="/methodology" className="hover:text-cyan-400 transition-colors">Empirical Breach & Wave Physics</Link></li>
            <li><Link href="/technology" className="hover:text-cyan-400 transition-colors">Tech Stack & SPH Roadmap</Link></li>
            <li><Link href="/architecture" className="hover:text-cyan-400 transition-colors">System Architecture</Link></li>
            <li><Link href="/data" className="hover:text-cyan-400 transition-colors">DEM & River Spatial Datasets</Link></li>
            <li><Link href="/exports" className="hover:text-cyan-400 transition-colors">GIS Export Formats</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3 text-sm tracking-wide">Scientific Honesty Notice</h4>
          <p className="text-slate-400 leading-relaxed mb-3">
            This system runs a prototype empirical breach & 1D/2D wave attenuation model labeled as 
            <span className="text-cyan-300 font-mono font-semibold"> "Prototype Decision-Support Model"</span>.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Architecture is engineered as <span className="text-emerald-400 font-mono font-semibold">"Hydrodynamic Solver Integration Ready"</span> for future validated SPH/Delft3D solver engines.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-slate-500">
        <p>© 2026 FLOODSIM Team • SIH Problem 26161. All rights reserved.</p>
        <p className="font-mono text-[11px]">Built with Next.js • React • Tailwind CSS • Leaflet • FastAPI • SQLAlchemy</p>
      </div>
    </footer>
  );
};
