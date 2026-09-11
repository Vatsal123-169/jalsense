/**
 * GIS Interactive Map Visualizer using Leaflet.js
 * Visualizes Dam Location, River Hydro-Channel, Inundation Extent Polygon, Wave Propagation, and Settlement Risk Markers
 */

class MapViz {
  constructor(mapContainerId) {
    this.containerId = mapContainerId;
    this.map = null;
    this.damMarker = null;
    this.riverPolyline = null;
    this.inundationLayers = [];
    this.nodeMarkers = [];
    this.waveAnimationLayer = null;
  }

  init(initialScenario) {
    // Initialize Leaflet map with dark theme tiles
    this.map = L.map(this.containerId, {
      center: initialScenario.center,
      zoom: initialScenario.zoom,
      zoomControl: true,
      attributionControl: false
    });

    // Dark Tile Layer (CartoDB Dark Matter / Esri Imagery mix for crisp GIS visual)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);

    this.renderScenario(initialScenario, 0);
  }

  renderScenario(scenario, currentTimeHours = 0) {
    // Clear existing layers
    this.clearLayers();

    // 1. Render Dam Breach Marker
    const damIcon = L.divIcon({
      className: 'custom-dam-icon',
      html: `<div style="
        background: #ff3b5c;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid #ffffff;
        box-shadow: 0 0 15px #ff3b5c;
        display: flex; align-items: center; justify-content: center;
        color: #fff; font-size: 10px; font-weight: 800;
      ">⚡</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    this.damMarker = L.marker(scenario.damCoords, { icon: damIcon })
      .bindPopup(`
        <div style="color: #0f172a; font-family: sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; color: #ff3b5c;">⚠️ BREACH ORIGIN: ${scenario.damName}</h4>
          <p style="margin: 0; font-size: 12px; color: #475569;">Height: <b>${scenario.damHeight}m</b> | Capacity: <b>${scenario.storageVolumeMCM} MCM</b></p>
        </div>
      `)
      .addTo(this.map);

    // 2. Render Main River Polyline Channel
    this.riverPolyline = L.polyline(scenario.riverPath, {
      color: '#00f2fe',
      weight: 4,
      opacity: 0.8,
      dashArray: '8, 8'
    }).addTo(this.map);

    // 3. Render Downstream Settlement & Infra Markers
    scenario.nodes.forEach(node => {
      const isSubmerged = currentTimeHours >= node.timeOfArrivalHours;
      const markerColor = isSubmerged 
        ? (node.currentDepthM > 4 ? '#ff3b5c' : '#ffb703') 
        : '#10b981';

      const nodeIcon = L.divIcon({
        className: 'custom-node-icon',
        html: `<div style="
          background: ${markerColor};
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px ${markerColor};
          transition: all 0.3s ease;
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker(node.coords, { icon: nodeIcon })
        .bindPopup(`
          <div style="color: #0f172a; font-family: sans-serif; min-width: 180px;">
            <h4 style="margin: 0 0 4px 0;">📍 ${node.name}</h4>
            <p style="margin: 2px 0; font-size: 12px;">Distance: <b>${node.distanceKm} km downstream</b></p>
            <p style="margin: 2px 0; font-size: 12px;">Est. Wave Arrival: <b>T+${node.timeOfArrivalHours} hrs</b></p>
            <p style="margin: 2px 0; font-size: 12px; color: ${markerColor}">Current Depth: <b>${node.currentDepthM || 0} m</b></p>
            <p style="margin: 2px 0; font-size: 12px;">Population at Risk: <b>${node.population.toLocaleString()}</b></p>
          </div>
        `)
        .addTo(this.map);

      this.nodeMarkers.push(marker);
    });

    // 4. Update Inundation Wave Front Polygon based on Current Simulation Time
    this.updateInundationFront(scenario, currentTimeHours);
  }

  updateInundationFront(scenario, currentTimeHours) {
    // Remove previous inundation polygon layers
    if (this.inundationLayers.length > 0) {
      this.inundationLayers.forEach(layer => this.map.removeLayer(layer));
      this.inundationLayers = [];
    }

    if (currentTimeHours <= 0) return;

    // Calculate reach of flood wave along river path based on simulation time
    const maxReachKm = currentTimeHours * 18.0; // ~18 km/h wave front propagation
    const riverCoords = scenario.riverPath;
    
    // Construct dynamic inundation corridor polygon
    const floodedPoints = [riverCoords[0]];
    let accumulatedDist = 0;

    for (let i = 1; i < riverCoords.length; i++) {
      const p1 = L.latLng(riverCoords[i - 1]);
      const p2 = L.latLng(riverCoords[i]);
      const segmentKm = p1.distanceTo(p2) / 1000;

      if (accumulatedDist + segmentKm <= maxReachKm) {
        floodedPoints.push(riverCoords[i]);
        accumulatedDist += segmentKm;
      } else {
        // Interpolate endpoint along segment
        const ratio = (maxReachKm - accumulatedDist) / segmentKm;
        const lat = p1.lat + (p2.lat - p1.lat) * ratio;
        const lng = p1.lng + (p2.lng - p1.lng) * ratio;
        floodedPoints.push([lat, lng]);
        break;
      }
    }

    if (floodedPoints.length < 2) return;

    // Build Left & Right buffer banks to simulate 2D inundation width expanding downstream
    const leftBank = [];
    const rightBank = [];

    floodedPoints.forEach((pt, idx) => {
      // Dynamic width expansion: wider near dam break, attenuates downstream
      const spreadKm = Math.max(0.4, (2.5 - (idx * 0.15))) / 111.0; // rough deg offset
      leftBank.push([pt[0] + spreadKm, pt[1] - spreadKm * 0.8]);
      rightBank.unshift([pt[0] - spreadKm, pt[1] + spreadKm * 0.8]);
    });

    const polygonCoords = [...leftBank, ...rightBank];

    // High danger core layer (red glow)
    const dangerPoly = L.polygon(polygonCoords, {
      color: '#ff3b5c',
      fillColor: '#ff3b5c',
      fillOpacity: 0.45,
      weight: 2,
      dashArray: '4, 4'
    }).addTo(this.map);

    // Outer warning surge layer (cyan glow)
    const surgePoly = L.polygon(polygonCoords, {
      color: '#00f2fe',
      fillColor: '#00f2fe',
      fillOpacity: 0.18,
      weight: 1
    }).addTo(this.map);

    this.inundationLayers.push(dangerPoly, surgePoly);
  }

  clearLayers() {
    if (this.damMarker) this.map.removeLayer(this.damMarker);
    if (this.riverPolyline) this.map.removeLayer(this.riverPolyline);
    this.nodeMarkers.forEach(m => this.map.removeLayer(m));
    this.nodeMarkers = [];
    this.inundationLayers.forEach(l => this.map.removeLayer(l));
    this.inundationLayers = [];
  }

  recenter(coords, zoom = 12) {
    if (this.map) {
      this.map.setView(coords, zoom);
    }
  }
}

// Global Map Instance
window.mapViz = new MapViz('map');
