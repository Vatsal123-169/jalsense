/**
 * Chart Visualizer using Chart.js
 * Renders dynamic Hydrograph curves, Downstream Water Depth profiles, and Telemetry metrics.
 */

class ChartViz {
  constructor() {
    this.hydrographChart = null;
    this.depthProfileChart = null;
  }

  /**
   * Render Outflow Hydrograph Chart Q(t)
   */
  initHydrographChart(canvasId, dataPoints) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    if (this.hydrographChart) {
      this.hydrographChart.destroy();
    }

    const labels = dataPoints.map(p => `T+${p.time}h`);
    const discharges = dataPoints.map(p => p.discharge);

    // Create glowing neon gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(0, 242, 254, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

    this.hydrographChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Outflow Discharge Q (m³/s)',
          data: discharges,
          borderColor: '#00f2fe',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#00f2fe'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#0f172a',
            titleColor: '#00f2fe',
            bodyColor: '#f8fafc',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { size: 10, family: 'JetBrains Mono' } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { size: 10, family: 'JetBrains Mono' } }
          }
        }
      }
    });
  }

  /**
   * Render Downstream Water Depth & Velocity Profile Chart
   */
  initDepthProfileChart(canvasId, nodes) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    if (this.depthProfileChart) {
      this.depthProfileChart.destroy();
    }

    const labels = nodes.map(n => `${n.distanceKm}km (${n.name})`);
    const depths = nodes.map(n => n.currentDepthM || 0);
    const velocities = nodes.map(n => n.currentVelocityMS || 0);

    this.depthProfileChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Water Depth (m)',
            data: depths,
            backgroundColor: 'rgba(255, 59, 92, 0.7)',
            borderColor: '#ff3b5c',
            borderWidth: 1.5,
            borderRadius: 4,
            yAxisID: 'y'
          },
          {
            label: 'Flow Velocity (m/s)',
            data: velocities,
            type: 'line',
            borderColor: '#ffb703',
            backgroundColor: 'rgba(255, 183, 3, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { color: '#94a3b8', font: { size: 10 } }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#ff3b5c',
            bodyColor: '#f8fafc'
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#64748b', font: { size: 9 } }
          },
          y: {
            type: 'linear',
            position: 'left',
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#ff3b5c', font: { size: 10 } },
            title: { display: true, text: 'Depth (m)', color: '#ff3b5c', font: { size: 10 } }
          },
          y1: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#ffb703', font: { size: 10 } },
            title: { display: true, text: 'Velocity (m/s)', color: '#ffb703', font: { size: 10 } }
          }
        }
      }
    });
  }
}

// Global Chart Instance
window.chartViz = new ChartViz();
