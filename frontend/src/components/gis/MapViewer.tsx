'use client';

import React, { useEffect, useRef } from 'react';
import { Scenario, DownstreamNode } from '@/types';

interface MapViewerProps {
  scenario: Scenario;
  currentTimeHours: number;
  inundationPolygon?: Array<[number, number]>;
  updatedNodes?: DownstreamNode[];
  className?: string;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  scenario,
  currentTimeHours,
  inundationPolygon = [],
  updatedNodes = [],
  className = 'h-[500px] w-full rounded-xl overflow-hidden'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{
    damMarker?: any;
    riverPolyline?: any;
    nodeMarkers: any[];
    polygonLayers: any[];
  }>({ nodeMarkers: [], polygonLayers: [] });

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Dynamically inject Leaflet CSS if not loaded
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: scenario.dam_coords,
          zoom: 11,
          zoomControl: true,
          attributionControl: false
        });

        // Use free open basemap tiles (CartoDB Dark Matter with OpenStreetMap fallback - zero API key required)
        const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd'
        });

        darkTiles.addTo(map);
        mapInstanceRef.current = map;
      }

      renderLayers(L);
    };

    loadLeaflet();
  }, [scenario, currentTimeHours, inundationPolygon, updatedNodes]);

  const renderLayers = (L: any) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous layers
    if (layersRef.current.damMarker) map.removeLayer(layersRef.current.damMarker);
    if (layersRef.current.riverPolyline) map.removeLayer(layersRef.current.riverPolyline);
    layersRef.current.nodeMarkers.forEach((m: any) => map.removeLayer(m));
    layersRef.current.nodeMarkers = [];
    layersRef.current.polygonLayers.forEach((l: any) => map.removeLayer(l));
    layersRef.current.polygonLayers = [];

    // Recenter view if dam changes
    map.setView(scenario.dam_coords, 11);

    // 1. Dam Breach Marker
    const damIcon = L.divIcon({
      className: 'dam-marker-icon',
      html: `<div style="
        background: #ff3b5c;
        width: 26px; height: 26px;
        border-radius: 50%;
        border: 3px solid #ffffff;
        box-shadow: 0 0 16px #ff3b5c;
        display: flex; align-items: center; justify-content: center;
        color: #ffffff; font-size: 11px; font-weight: 900;
      ">⚡</div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    layersRef.current.damMarker = L.marker(scenario.dam_coords, { icon: damIcon })
      .bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; color: #0f172a;">
          <h4 style="margin: 0 0 4px 0; color: #ff3b5c; font-size: 13px; font-weight: 800;">⚠️ BREACH ORIGIN: ${scenario.dam_name}</h4>
          <p style="margin: 0; font-size: 11px; color: #475569;">Height: <b>${scenario.dam_height_m}m</b> | Storage: <b>${scenario.storage_volume_mcm} MCM</b></p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #475569;">Breach Width: <b>${scenario.breach_width_m}m</b> | Mode: <b>${scenario.failure_mode}</b></p>
        </div>
      `)
      .addTo(map);

    // 2. River Polyline
    if (scenario.river_path && scenario.river_path.length > 0) {
      layersRef.current.riverPolyline = L.polyline(scenario.river_path, {
        color: '#00f2fe',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8'
      }).addTo(map);
    }

    // 3. Settlement Markers
    const nodesToRender = updatedNodes.length > 0 ? updatedNodes : scenario.downstream_nodes;
    nodesToRender.forEach((node) => {
      const isSubmerged = currentTimeHours >= node.timeOfArrivalHours;
      const depth = node.currentDepthM || 0;

      let color = '#10b981'; // Safe
      if (isSubmerged) {
        if (depth > 5) color = '#ff3b5c'; // Extreme
        else if (depth > 2) color = '#ffb703'; // High risk
        else color = '#00f2fe'; // Alert/Moderate
      }

      const nodeIcon = L.divIcon({
        className: 'node-marker-icon',
        html: `<div style="
          background: ${color};
          width: 18px; height: 18px;
          border-radius: 4px;
          border: 2px solid #ffffff;
          box-shadow: 0 0 12px ${color};
        "></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      const marker = L.marker(node.coords, { icon: nodeIcon })
        .bindPopup(`
          <div style="font-family: sans-serif; color: #0f172a; min-width: 170px;">
            <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700;">📍 ${node.name}</h4>
            <p style="margin: 2px 0; font-size: 11px;">Distance: <b>${node.distanceKm} km downstream</b></p>
            <p style="margin: 2px 0; font-size: 11px;">Est. Arrival: <b>T+${node.timeOfArrivalHours} hrs</b></p>
            <p style="margin: 2px 0; font-size: 11px; color: ${color}; font-weight: 700;">Current Depth: <b>${depth} m</b></p>
            <p style="margin: 2px 0; font-size: 11px;">Population at Risk: <b>${node.population.toLocaleString()}</b></p>
          </div>
        `)
        .addTo(map);

      layersRef.current.nodeMarkers.push(marker);
    });

    // 4. Inundation Polygon
    if (inundationPolygon && inundationPolygon.length > 2) {
      const dangerPoly = L.polygon(inundationPolygon, {
        color: '#ff3b5c',
        fillColor: '#ff3b5c',
        fillOpacity: 0.45,
        weight: 2,
        dashArray: '4, 4'
      }).addTo(map);

      const surgePoly = L.polygon(inundationPolygon, {
        color: '#00f2fe',
        fillColor: '#00f2fe',
        fillOpacity: 0.18,
        weight: 1
      }).addTo(map);

      layersRef.current.polygonLayers.push(dangerPoly, surgePoly);
    }
  };

  return (
    <div className="relative group">
      {/* Map Container */}
      <div ref={mapContainerRef} className={className} />

      {/* Floating GIS Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-3 rounded-lg text-xs text-white z-[1000] shadow-xl pointer-events-auto">
        <div className="font-semibold text-slate-300 mb-2 border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>GIS Risk Legend</span>
          <span className="text-[10px] text-cyan-400 font-mono">T+{currentTimeHours.toFixed(1)}h</span>
        </div>
        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 border border-white"></span>
            <span>Breach Origin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-rose-500 border border-white"></span>
            <span>Extreme Danger (&gt;5m)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-500 border border-white"></span>
            <span>High Risk (2m - 5m)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-cyan-400 border border-white"></span>
            <span>Warning / Surge (&lt;2m)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500 border border-white"></span>
            <span>Safe / Unaffected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
