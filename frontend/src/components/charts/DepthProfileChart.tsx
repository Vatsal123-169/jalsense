'use client';

import React from 'react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { DownstreamNode } from '@/types';

interface DepthProfileChartProps {
  nodes: DownstreamNode[];
  currentTimeHours: number;
}

export const DepthProfileChart: React.FC<DepthProfileChartProps> = ({ nodes, currentTimeHours }) => {
  const chartData = nodes.map(n => ({
    name: n.name,
    distLabel: `${n.distanceKm}km`,
    depth: n.currentDepthM || 0,
    velocity: n.currentVelocityMS || 0,
    status: n.status
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-bold text-sm text-rose-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            Downstream Flood Depth & Velocity Profile
          </h3>
          <p className="text-xs text-slate-400">Water depth (m) and wave velocity (m/s) across downstream check stations</p>
        </div>
        <span className="text-xs font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-cyan-400">
          Timestep: T+{currentTimeHours.toFixed(1)}h
        </span>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="distLabel" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="left" stroke="#ff3b5c" tick={{ fontSize: 10 }} label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fill: '#ff3b5c', fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" stroke="#ffb703" tick={{ fontSize: 10 }} label={{ value: 'Velocity (m/s)', angle: 90, position: 'insideRight', fill: '#ffb703', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Bar yAxisId="left" dataKey="depth" name="Water Depth (m)" fill="#ff3b5c" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="velocity" name="Wave Velocity (m/s)" stroke="#ffb703" strokeWidth={2.5} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
