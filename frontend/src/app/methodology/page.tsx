'use client';

import React from 'react';
import { Info, Waves, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Info className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            SCIENTIFIC METHODOLOGY
          </span>
        </div>
        <h1 className="text-3xl font-black text-white font-mono tracking-tight">
          Empirical Breach & Hydrodynamic Wave Formulations
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Mathematical foundations governing FLOODSIM's prototype decision-support simulation model.
        </p>
      </div>

      {/* Physics Equations Cards */}
      <div className="space-y-6">
        {/* 1. Froehlich Breach Width */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h3 className="font-bold text-base text-cyan-400 font-mono">1. Froehlich (2008) Breach Width Formulation</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {'Estimates average breach width B_w (meters) based on reservoir volume V (m³), breach depth H_b (m), and failure mode multiplier K_o.'}
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm text-cyan-300 text-center">
            {'B_w = 0.027 · K_o · V^0.32 · H_b^0.19'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {'Where K_o = 1.3 for overtopping failure and K_o = 1.0 for piping internal erosion failure.'}
          </div>
        </div>

        {/* 2. Breach Formation Time */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h3 className="font-bold text-base text-amber-400 font-mono">2. Breach Formation Time t_b</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Calculates full breach development duration t_b (hours).
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm text-amber-300 text-center">
            {'t_b = 0.0177 · V^0.53 · H^-0.90'}
          </div>
        </div>

        {/* 3. Peak Discharge Q_peak */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h3 className="font-bold text-base text-rose-400 font-mono">3. Peak Outflow Discharge Q_peak</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {'Determines peak breach outflow discharge Q_peak (m³/s) using MacDonald & Langridge-Monopolis and Froehlich formulations.'}
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm text-rose-300 text-center">
            {'Q_peak = 0.607 · (C_d / 0.6) · V^0.295 · H^1.24 + Q_inflow'}
          </div>
        </div>

        {/* 4. Downstream Wave Speed & Attenuation */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h3 className="font-bold text-base text-emerald-400 font-mono">4. Wave Speed & Depth Attenuation</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {'Translates wave celerity c = √(g h) + v downstream along the river hydro-channel and computes depth attenuation D(x,t).'}
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm text-emerald-300 text-center">
            {'D(x) = D_0 · (x_0 / (x + x_0))^0.6'}
          </div>
        </div>
      </div>
    </div>
  );
}
