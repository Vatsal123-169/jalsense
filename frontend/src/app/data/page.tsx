'use client';

import React, { useState } from 'react';
import { Database, Upload, FileCode, CheckCircle2 } from 'lucide-react';
import { DatasetItem } from '@/types';

export default function DataCenterPage() {
  const [datasets, setDatasets] = useState<DatasetItem[]>([
    { id: 'ds-dem-uttarakhand', name: 'SRTM 30m DEM - Rishi Ganga River Basin', data_type: 'DEM', format: 'GeoTIFF', size_mb: 42.5, status: 'ACTIVE' },
    { id: 'ds-river-teesta', name: 'Teesta River High-Res Vector Channel', data_type: 'River', format: 'GeoJSON', size_mb: 4.2, status: 'ACTIVE' },
    { id: 'ds-dam-registry', name: 'CWC National Register of Large Dams (NRLD 2026)', data_type: 'Dam', format: 'CSV', size_mb: 12.8, status: 'ACTIVE' },
    { id: 'ds-sat-sentinel1', name: 'Sentinel-1 SAR Post-Disaster Flood Mask (Sikkim)', data_type: 'Satellite', format: 'GeoTIFF', size_mb: 115.0, status: 'ACTIVE' }
  ]);

  const [uploadName, setUploadName] = useState('');
  const [uploadType, setUploadType] = useState('DEM');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName) return;
    const newItem: DatasetItem = {
      id: `ds-${Date.now()}`,
      name: uploadName,
      data_type: uploadType as any,
      format: 'GeoJSON',
      size_mb: 8.5,
      status: 'ACTIVE'
    };
    setDatasets([newItem, ...datasets]);
    setUploadName('');
    alert(`Dataset "${uploadName}" uploaded & validated successfully!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              GEOSPATIAL DATA CENTER
            </span>
          </div>
          <h1 className="text-2xl font-black text-white font-mono tracking-tight">
            DEM, River & Dam Spatial Datasets
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Register, validate, and manage elevation rasters (DEM), hydrological channels, and dam structural metadata.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm text-white font-mono flex items-center gap-2">
            <Upload className="w-4 h-4 text-cyan-400" />
            Upload Spatial Dataset
          </h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Dataset Name</label>
              <input
                type="text"
                placeholder="e.g. Alaknanda Basin 10m DEM"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Layer Type</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="DEM">DEM (Digital Elevation Model)</option>
                <option value="River">River Hydro Vector Channel</option>
                <option value="Dam">Dam Registry & Capacity CSV</option>
                <option value="Satellite">Satellite Earth Observation Mask</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">File (GeoJSON, SHP, KML, CSV, GeoTIFF)</label>
              <input
                type="file"
                className="w-full text-xs text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-cyan-500 file:text-slate-950 file:font-bold"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs py-2.5 rounded-lg shadow-lg shadow-cyan-500/25 transition-all"
            >
              Upload & Validate Dataset
            </button>
          </form>
        </div>

        {/* Registered Datasets Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm text-white font-mono flex items-center justify-between border-b border-slate-800 pb-3">
            <span>Active Dataset Registry</span>
            <span className="text-xs text-cyan-400">{datasets.length} Datasets Active</span>
          </h3>

          <div className="space-y-3">
            {datasets.map((ds) => (
              <div key={ds.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs">
                <div>
                  <div className="font-bold text-white text-sm mb-1">{ds.name}</div>
                  <div className="text-slate-400 text-[11px]">
                    Type: <b className="text-cyan-400">{ds.data_type}</b> • Format: <b className="text-amber-400">{ds.format}</b> • Size: {ds.size_mb} MB
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {ds.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
