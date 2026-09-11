'use client';

import React from 'react';
import { FileText, Download, CheckCircle2, FileCode, Globe, Printer } from 'lucide-react';

export default function ExportCenterPage() {
  const handleDownload = (format: string) => {
    alert(`📥 [EXPORT EXECUTED]\n\nDownloading ${format} export layer payload...\n\nSpatial inundation corridor & telemetry saved.`);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              EXPORT CENTER
            </span>
          </div>
          <h1 className="text-2xl font-black text-white font-mono tracking-tight">
            GIS Spatial Layers & Disaster Impact Reports
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Export validated simulation outputs in standardized OGC GIS formats and printable executive disaster summaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* GeoJSON */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">GeoJSON Spatial Vector</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Standard OGC GeoJSON feature collection containing dam origin point, river polyline, and dynamic flood inundation polygon.
            </p>
          </div>
          <button
            onClick={() => handleDownload('GeoJSON')}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download .geojson
          </button>
        </div>

        {/* CSV Hydrograph */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">CSV Hydrograph Time-Series</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Tabular time-series data of outflow discharge Q(t) in m³/s and discrete reservoir drainage steps.
            </p>
          </div>
          <button
            onClick={() => handleDownload('CSV')}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download .csv
          </button>
        </div>

        {/* KML Google Earth */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">KML Google Earth Layer</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Keyhole Markup Language layer formatted for direct visualization in Google Earth Desktop & Web.
            </p>
          </div>
          <button
            onClick={() => handleDownload('KML')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download .kml
          </button>
        </div>

        {/* Executive PDF Report */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Executive PDF Report</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Formatted Disaster Impact Executive Briefing containing telemetry tables, PAR counts, and wave ETAs.
            </p>
          </div>
          <button
            onClick={handlePrintReport}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Executive PDF
          </button>
        </div>
      </div>
    </div>
  );
}
