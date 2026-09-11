'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Activity, Play, Database, Layers, Cpu, FileText, Info, Eye, Layers3, Users, Settings } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Activity },
    { name: 'Simulation', href: '/simulation', icon: Play },
    { name: 'Scenarios', href: '/scenarios', icon: Layers },
    { name: 'Compare', href: '/compare', icon: Layers3 },
    { name: 'Satellite', href: '/satellite', icon: Eye },
    { name: 'Data Center', href: '/data', icon: Database },
    { name: 'Exports', href: '/exports', icon: FileText },
    { name: 'Methodology', href: '/methodology', icon: Info },
    { name: 'Architecture', href: '/architecture', icon: Cpu },
  ];

  return (
    <header className="bg-slate-950 border-b border-slate-800 text-white sticky top-0 z-50 shadow-lg">
      {/* Top Banner Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 px-4 py-1 flex items-center justify-between text-xs border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded font-mono font-semibold">
            SIH 2026 • PS 26161
          </span>
          <span className="text-slate-400 hidden md:inline">
            Hydrodynamic Breach & Inundation Decision-Support Engine
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SYSTEM READY
          </span>
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-medium">
            DEMO MODE
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-wider text-white font-mono flex items-center gap-1">
              FLOOD<span className="text-cyan-400">SIM</span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
              Hydrodynamic Decision Support
            </p>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/simulation"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition-all hover:shadow-cyan-500/40"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Launch Simulation
          </Link>
        </div>
      </div>
    </header>
  );
};
