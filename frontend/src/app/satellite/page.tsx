'use client';

import React from 'react';
import { Eye, CheckCircle2, Satellite, Layers, RefreshCw } from 'lucide-react';

export default function SatelliteValidationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              SATELLITE VALIDATION WORKSPACE
            </span>
          </div>
          <h1 className="text-2xl font-black text-white font-mono tracking-tight">
            Google Earth Engine & Satellite Flood Mask Validation
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Cross-validate simulated hydrodynamic inundation boundaries against Earth Observation satellite imagery (Sentinel-1 SAR / Landsat-9).
          </p>
        </div>

        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-xl font-mono text-xs font-semibold">
          GEE Integration Ready
        </span>
      </div>

      {/* Workflow Architecture Diagram */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h3 className="font-bold text-sm text-white mb-4 font-mono">Satellite Validation Flow Architecture</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-center text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <Satellite className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <div className="font-bold text-white">Sentinel-1 SAR</div>
            <div className="text-[10px] text-slate-500">Radar Imagery</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-cyan-400 font-bold">GEE API</div>
            <div className="text-[10px] text-slate-500">Google Earth Engine</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-amber-400 font-bold">Observed Mask</div>
            <div className="text-[10px] text-slate-500">Water Extent</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-emerald-400 font-bold">Simulated Mask</div>
            <div className="text-[10px] text-slate-500">FLOODSIM Extent</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-cyan-400 font-bold">Spatial Overlay</div>
            <div className="text-[10px] text-slate-500">Intersection / IoU</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-emerald-400 font-bold">IoU Score</div>
            <div className="text-[10px] text-slate-500">Validation Metric</div>
          </div>
        </div>
      </div>

      {/* Demonstration Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="font-bold text-sm text-white">Teesta Basin Sentinel-1 SAR Overlay (Demo Baseline)</h4>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
            IoU Fit Metric: 88.4% Spatial Accuracy
          </span>
        </div>

        <div className="bg-slate-950 h-72 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
          <div className="text-center font-mono space-y-2">
            <Satellite className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
            <div className="text-sm font-bold text-white">Google Earth Engine Pipeline Ready</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Future production deployment connects live GEE service accounts to pull pre/post flood Sentinel-1 VV/VH backscatter rasters for direct spatial intersection scoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
