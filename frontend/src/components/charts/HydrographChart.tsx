'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { HydrographPoint } from '@/types';

interface HydrographChartProps {
  dataPoints: HydrographPoint[];
  peakDischarge: number;
  timeToPeak: number;
  totalVolumeMCM: number;
}

export const HydrographChart: React.FC<HydrographChartProps> = ({
  dataPoints,
  peakDischarge,
  timeToPeak,
  totalVolumeMCM
}) => {
  const formattedData = dataPoints.map(p => ({
    timeLabel: `T+${p.time_hours}h`,
    time_hours: p.time_hours,
    discharge: p.discharge_cms
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-slate-800 pb-3 gap-2">
        <div>
          <h3 className="font-bold text-sm text-cyan-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Breach Outflow Hydrograph Q(t)
          </h3>
          <p className="text-xs text-slate-400">Time-series discharge curve at breach cross-section</p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <span className="text-slate-400">Peak Discharge Q: </span>
            <span className="text-cyan-400 font-bold">{peakDischarge.toLocaleString()} m³/s</span>
          </div>
          <div className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <span className="text-slate-400">Volume: </span>
            <span className="text-amber-400 font-bold">{totalVolumeMCM} MCM</span>
          </div>
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="hydroGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="timeLabel"
              stroke="#64748b"
              tick={{ fontSize: 10, fill: '#64748b' }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0b0f19',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px'
              }}
              formatter={(value: any) => [`${Number(value).toLocaleString()} m³/s`, 'Outflow Q']}
              labelFormatter={(label) => `Time step: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="discharge"
              stroke="#00f2fe"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#hydroGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
