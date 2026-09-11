'use client';

import React from 'react';
import { Settings, ShieldCheck, Database, Server } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            SYSTEM SETTINGS
          </span>
        </div>
        <h1 className="text-3xl font-black text-white font-mono tracking-tight">
          Platform Configuration & Credentials
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Manage API endpoint connections, database connections, and GEE service accounts.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-slate-300">FastAPI Backend Endpoint</span>
          <span className="text-cyan-400 font-bold">http://localhost:8000/api</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-slate-300">Database Connection</span>
          <span className="text-emerald-400 font-bold">SQLite (Standalone Demo Mode)</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-slate-300">GEE Service Account</span>
          <span className="text-amber-400 font-bold">Integration Ready</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-slate-300">SIH 2026 Problem Statement</span>
          <span className="text-cyan-400 font-bold">26161</span>
        </div>
      </div>
    </div>
  );
}
