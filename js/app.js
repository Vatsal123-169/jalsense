/**
 * Main Application Controller for SIH26161 Dam Break Inundation Platform
 * Controls UI event listeners, physics simulation loops, scenario management, and export actions.
 */

class AppController {
  constructor() {
    this.currentTimeHours = 0;
    this.isPlaying = false;
    this.playSpeed = 1; // 1x, 2x, 5x
    this.timerId = null;

    // Preset Scenarios
    this.scenarios = {
      rishiganga: {
        id: 'rishiganga',
        title: 'Rishi Ganga River Outburst (Uttarakhand)',
        damName: 'Tapovan-Vishnugad Dam',
        damCoords: [30.4952, 79.6247],
        center: [30.4300, 79.5000],
        zoom: 11,
        damHeight: 48,
        storageVolumeMCM: 65,
        breachWidth: 120,
        breachTimeHours: 0.8,
        inflow: 200,
        riverPath: [
          [30.4952, 79.6247], // Dam
          [30.4810, 79.5980], // Tapovan
          [30.4650, 79.5630], // Raini
          [30.4420, 79.5100], // Helang
          [30.4180, 79.4600], // Joshimath lower
          [30.3800, 79.3900], // Birahi
          [30.3400, 79.3300]  // Chamoli
        ],
        nodes: [
          { name: 'Tapovan Hydro Barrage', distanceKm: 4.5, population: 450, coords: [30.4810, 79.5980] },
          { name: 'Raini Chakta Village', distanceKm: 11.2, population: 1850, coords: [30.4650, 79.5630] },
          { name: 'Joshimath Lower Ridge', distanceKm: 22.8, population: 12400, coords: [30.4180, 79.4600] },
          { name: 'Chamoli District HQ', distanceKm: 48.0, population: 32000, coords: [30.3400, 79.3300] }
        ]
      },
      teesta: {
        id: 'teesta',
        title: 'Teesta Stage-III Surge (Sikkim)',
        damName: 'Chungthang Dam',
        damCoords: [27.6042, 88.6475],
        center: [27.4200, 88.5200],
        zoom: 10,
        damHeight: 60,
        storageVolumeMCM: 145,
        breachWidth: 160,
        breachTimeHours: 1.2,
        inflow: 350,
        riverPath: [
          [27.6042, 88.6475], // Dam
          [27.5180, 88.5420], // Mangan
          [27.3820, 88.5080], // Dikchu
          [27.2340, 88.4720], // Singtam
          [27.1750, 88.5320]  // Rangpo
        ],
        nodes: [
          { name: 'Chungthang Powerhouse', distanceKm: 3.2, population: 820, coords: [27.5840, 88.6120] },
          { name: 'Mangan Township', distanceKm: 18.5, population: 8600, coords: [27.5180, 88.5420] },
          { name: 'Singtam National Highway Bridge', distanceKm: 38.0, population: 19500, coords: [27.2340, 88.4720] },
          { name: 'Rangpo Border Hub', distanceKm: 54.2, population: 28000, coords: [27.1750, 88.5320] }
        ]
      },
      bhakra: {
        id: 'bhakra',
        title: 'Bhakra Extreme PMF Scenario (Himachal)',
        damName: 'Bhakra High Gravity Dam',
        damCoords: [31.4116, 76.4358],
        center: [31.3000, 76.4000],
        zoom: 10,
        damHeight: 226,
        storageVolumeMCM: 9620,
        breachWidth: 420,
        breachTimeHours: 2.8,
        inflow: 1200,
        riverPath: [
          [31.4116, 76.4358], // Dam
          [31.3700, 76.3800], // Nangal
          [31.2300, 76.5000], // Anandpur
          [31.1000, 76.5200], // Ropar
          [30.9800, 76.4800]  // Kurali
        ],
        nodes: [
          { name: 'Nangal Hydel Canal Barrage', distanceKm: 9.8, population: 14500, coords: [31.3700, 76.3800] },
          { name: 'Anandpur Sahib Basin', distanceKm: 27.5, population: 42000, coords: [31.2300, 76.5000] },
          { name: 'Ropar Headworks', distanceKm: 48.0, population: 78000, coords: [31.1000, 76.5200] }
        ]
      }
    };

    this.activeScenario = this.scenarios.rishiganga;
  }

  init() {
    // 1. Initialize Leaflet Map
    window.mapViz.init(this.activeScenario);

    // 2. Bind UI Elements & Event Listeners
    this.bindEvents();

    // 3. Initial Hydrodynamic Simulation Run
    this.runSimulation();
  }

  bindEvents() {
    // Scenario Selector Buttons
    document.querySelectorAll('.btn-scenario').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-scenario').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const scenarioKey = btn.dataset.scenario;
        this.selectScenario(scenarioKey);
      });
    });

    // Slider Inputs
    const sliders = ['damHeight', 'storageVolume', 'breachWidth', 'breachTime', 'riverInflow'];
    sliders.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => {
          this.updateValueDisplay(id, input.value);
          this.runSimulation();
        });
      }
    });

    // Failure Mode Radio/Select
    const modeSelect = document.getElementById('failureMode');
    if (modeSelect) {
      modeSelect.addEventListener('change', () => this.runSimulation());
    }

    // Playback Controls
    const playBtn = document.getElementById('btnPlay');
    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlay());
    }

    const resetBtn = document.getElementById('btnReset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetPlayback());
    }

    const timelineSlider = document.getElementById('timelineSlider');
    if (timelineSlider) {
      timelineSlider.addEventListener('input', (e) => {
        this.currentTimeHours = parseFloat(e.target.value);
        this.updateTimeDisplay();
        this.renderSimulationStep();
      });
    }

    // Early Warning Alert Trigger
    const alertBtn = document.getElementById('btnBroadcastAlert');
    if (alertBtn) {
      alertBtn.addEventListener('click', () => this.broadcastCAPAlert());
    }

    // Export Report Button
    const reportBtn = document.getElementById('btnExportReport');
    if (reportBtn) {
      reportBtn.addEventListener('click', () => this.openReportModal());
    }

    const closeModal = document.getElementById('btnCloseModal');
    if (closeModal) {
      closeModal.addEventListener('click', () => {
        document.getElementById('reportModal').classList.remove('active');
      });
    }
  }

  selectScenario(key) {
    if (this.scenarios[key]) {
      this.activeScenario = this.scenarios[key];
      
      // Update UI Slider Values to Scenario defaults
      document.getElementById('damHeight').value = this.activeScenario.damHeight;
      this.updateValueDisplay('damHeight', this.activeScenario.damHeight);

      document.getElementById('storageVolume').value = this.activeScenario.storageVolumeMCM;
      this.updateValueDisplay('storageVolume', this.activeScenario.storageVolumeMCM);

      document.getElementById('breachWidth').value = this.activeScenario.breachWidth;
      this.updateValueDisplay('breachWidth', this.activeScenario.breachWidth);

      document.getElementById('breachTime').value = this.activeScenario.breachTimeHours;
      this.updateValueDisplay('breachTime', this.activeScenario.breachTimeHours);

      document.getElementById('riverInflow').value = this.activeScenario.inflow;
      this.updateValueDisplay('riverInflow', this.activeScenario.inflow);

      // Recenter map
      window.mapViz.recenter(this.activeScenario.center, this.activeScenario.zoom);

      this.resetPlayback();
      this.runSimulation();
    }
  }

  updateValueDisplay(id, val) {
    const display = document.getElementById(`${id}Val`);
    if (display) display.textContent = val;
  }

  runSimulation() {
    // Read Current Parameters from Sliders
    const params = {
      damHeight: document.getElementById('damHeight').value,
      storageVolumeMCM: document.getElementById('storageVolume').value,
      breachWidth: document.getElementById('breachWidth').value,
      breachTimeHours: document.getElementById('breachTime').value,
      inflow: document.getElementById('riverInflow').value,
      failureMode: document.getElementById('failureMode').value
    };

    // Calculate Hydrodynamic Physics via HydroEngine
    this.breachResult = window.hydroEngine.calculateBreach(params);
    this.hydrographData = window.hydroEngine.generateHydrograph(
      this.breachResult.Q_peak, 
      this.breachResult.breachTimeHours, 
      24
    );

    // Update Telemetry Metrics
    document.getElementById('metricQpeak').textContent = this.breachResult.Q_peak.toLocaleString();
    document.getElementById('metricBreachWidth').textContent = this.breachResult.breachWidth;
    document.getElementById('metricFormTime').textContent = this.breachResult.breachTimeHours;

    // Render Outflow Hydrograph Chart
    window.chartViz.initHydrographChart('hydrographChart', this.hydrographData);

    // Render Current Timestep Step
    this.renderSimulationStep();
  }

  renderSimulationStep() {
    // Calculate Wave propagation at currentTimeHours
    const updatedNodes = window.hydroEngine.calculateDownstreamWave(
      this.breachResult.Q_peak,
      this.currentTimeHours,
      this.activeScenario.nodes
    );

    this.activeNodesState = updatedNodes;

    // Render map inundation front
    window.mapViz.renderScenario(
      { ...this.activeScenario, nodes: updatedNodes }, 
      this.currentTimeHours
    );

    // Render Depth & Velocity Profile Chart
    window.chartViz.initDepthProfileChart('depthChart', updatedNodes);

    // Calculate Live Population at Risk (PAR) & Submerged Area
    let totalPAR = 0;
    let submergedCount = 0;
    let maxDepth = 0;

    updatedNodes.forEach(node => {
      if (this.currentTimeHours >= node.timeOfArrivalHours) {
        totalPAR += node.population;
        submergedCount++;
        if (node.currentDepthM > maxDepth) maxDepth = node.currentDepthM;
      }
    });

    const submergedAreaKm2 = Math.round(this.currentTimeHours * 3.4 * (this.breachResult.Q_peak / 5000));

    document.getElementById('metricPAR').textContent = totalPAR.toLocaleString();
    document.getElementById('metricArea').textContent = Math.min(240, submergedAreaKm2);
    document.getElementById('metricMaxDepth').textContent = maxDepth.toFixed(1);

    // Update Alert Banner
    const banner = document.getElementById('alertBannerText');
    if (banner) {
      if (submergedCount > 0) {
        banner.innerHTML = `<b style="color: #ff3b5c">CRITICAL INUNDATION ALERT:</b> ${submergedCount} downstream settlement(s) impacted. Peak Depth: <b>${maxDepth.toFixed(1)}m</b>. PAR: <b>${totalPAR.toLocaleString()}</b>.`;
      } else {
        banner.innerHTML = `<b>NORMAL STATE:</b> Breach simulation ready. Advance playback timeline to visualize flood wave arrival.`;
      }
    }
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    const btn = document.getElementById('btnPlay');

    if (this.isPlaying) {
      btn.innerHTML = `⏸️ Pause`;
      this.timerId = setInterval(() => {
        this.currentTimeHours += 0.25;
        if (this.currentTimeHours > 24) {
          this.currentTimeHours = 24;
          this.togglePlay();
        }
        document.getElementById('timelineSlider').value = this.currentTimeHours;
        this.updateTimeDisplay();
        this.renderSimulationStep();
      }, 300);
    } else {
      btn.innerHTML = `▶️ Play Simulation`;
      clearInterval(this.timerId);
    }
  }

  resetPlayback() {
    if (this.isPlaying) this.togglePlay();
    this.currentTimeHours = 0;
    document.getElementById('timelineSlider').value = 0;
    this.updateTimeDisplay();
    this.renderSimulationStep();
  }

  updateTimeDisplay() {
    document.getElementById('timeLabel').textContent = `T+${this.currentTimeHours.toFixed(1)}h`;
  }

  broadcastCAPAlert() {
    alert(`🚨 [NTRO EARLY WARNING SYSTEM DISPATCH]\n\nCAP Broadcast Protocol Transmitted!\n\nEvent: DAM BREACH FLOOD WAVE\nDam: ${this.activeScenario.damName}\nPeak Discharge: ${this.breachResult.Q_peak} m³/s\nPopulation at Risk: ${document.getElementById('metricPAR').textContent}\n\nSMS Broadcast sent to State Disaster Management Authority (SDMA) & NDMA Emergency Cell!`);
  }

  openReportModal() {
    const modal = document.getElementById('reportModal');
    const tableBody = document.getElementById('reportTableBody');

    let rowsHtml = '';
    this.activeNodesState.forEach(node => {
      rowsHtml += `
        <tr>
          <td><b>${node.name}</b></td>
          <td>${node.distanceKm} km</td>
          <td>T+${node.timeOfArrivalHours} hrs</td>
          <td>${node.currentDepthM || 0} m</td>
          <td>${node.currentVelocityMS || 0} m/s</td>
          <td>${node.population.toLocaleString()}</td>
          <td><span class="badge ${node.currentDepthM > 2 ? 'badge-ntro' : 'badge-live'}">${node.status}</span></td>
        </tr>
      `;
    });

    tableBody.innerHTML = rowsHtml;

    document.getElementById('reportDamName').textContent = this.activeScenario.damName;
    document.getElementById('reportQpeak').textContent = `${this.breachResult.Q_peak} m³/s`;
    document.getElementById('reportBreachWidth').textContent = `${this.breachResult.breachWidth} m`;

    modal.classList.add('active');
  }
}

// Instantiate App Controller on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
  window.app.init();
});
