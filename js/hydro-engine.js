/**
 * Hydrodynamic Breach & Wave Propagation Physics Engine
 * Implementation of empirical breach formulas (Froehlich, MacDonald-Langridge-Monopolis)
 * and 1D/2D shallow water wave attenuation for SIH26161 (NTRO).
 */

class HydroEngine {
  constructor() {
    this.gravity = 9.81; // m/s^2
  }

  /**
   * Calculate Dam Breach Physics Parameters
   * @param {Object} params { damHeight, storageVolumeMCM, breachWidth, breachTimeHours, failureMode, inflow }
   */
  calculateBreach(params) {
    const H = parseFloat(params.damHeight) || 45; // m
    const V_mcm = parseFloat(params.storageVolumeMCM) || 120; // Million Cubic Meters
    const V_m3 = V_mcm * 1e6; // Convert to m3
    const mode = params.failureMode || 'overtopping'; // 'overtopping' or 'piping'

    // Empirical Froehlich (2008) Breach Width Estimation
    // B_w = 0.027 * K_o * V^0.32 * H_b^0.19
    const Ko = mode === 'overtopping' ? 1.3 : 1.0;
    const calcBreachWidth = 0.027 * Ko * Math.pow(V_m3, 0.32) * Math.pow(H, 0.19);
    
    // User override or calculated breach width
    const breachWidth = params.breachWidth ? parseFloat(params.breachWidth) : Math.round(calcBreachWidth);

    // Empirical Breach Formation Time (hours)
    // t_b = 0.0177 * V^0.53 * H^-0.90
    const calcTimeHours = 0.0177 * Math.pow(V_m3, 0.53) * Math.pow(H, -0.9);
    const breachTimeHours = params.breachTimeHours ? parseFloat(params.breachTimeHours) : parseFloat(calcTimeHours.toFixed(2));

    // Peak Outflow Discharge Q_peak (m3/s)
    // MacDonald & Langridge-Monopolis / Froehlich equation:
    // Q_peak = 0.607 * V^0.295 * H^1.24
    let Q_peak = 0.607 * Math.pow(V_m3, 0.295) * Math.pow(H, 1.24);
    if (mode === 'piping') {
      Q_peak *= 0.85; // Piping typically results in ~15% lower peak than sudden overtopping
    }

    // Add baseline river inflow
    const inflow = parseFloat(params.inflow) || 150;
    Q_peak += inflow;

    return {
      H,
      V_mcm,
      V_m3,
      breachWidth: Math.round(breachWidth),
      breachTimeHours: Math.max(0.1, breachTimeHours),
      Q_peak: Math.round(Q_peak),
      failureMode: mode
    };
  }

  /**
   * Generate Breach Outflow Hydrograph Q(t) in m3/s over time
   * @param {number} Q_peak Peak Discharge
   * @param {number} breachTimeHours Time to breach
   * @param {number} maxHours Simulation duration (e.g. 24h)
   */
  generateHydrograph(Q_peak, breachTimeHours, maxHours = 24) {
    const points = [];
    const baseInflow = 150;
    const t_peak = breachTimeHours;

    for (let t = 0; t <= maxHours; t += 0.5) {
      let Q = baseInflow;
      if (t <= t_peak) {
        // Rising limb (quadratic growth)
        Q += (Q_peak - baseInflow) * Math.pow(t / t_peak, 2);
      } else {
        // Falling limb (exponential decay)
        const decayRate = 0.25 / (breachTimeHours || 1);
        Q += (Q_peak - baseInflow) * Math.exp(-decayRate * (t - t_peak));
      }
      points.push({ time: t, discharge: Math.round(Q) });
    }
    return points;
  }

  /**
   * Calculate Flood Wave Attenuation & Downstream Arrival Times
   * @param {number} Q_peak Peak Outflow
   * @param {number} currentTime Current simulation timestep (hours)
   * @param {Array} downstreamNodes Array of downstream checkpoints
   */
  calculateDownstreamWave(Q_peak, currentTime, downstreamNodes) {
    return downstreamNodes.map(node => {
      // Wave celerity c = sqrt(g * y) + v
      // Approximate wave travel speed (m/s) (~8-15 m/s for dam break wave)
      const waveSpeedMS = 12.0 - (node.distanceKm * 0.12); // Slows down downstream
      const waveSpeedKmH = Math.max(15, waveSpeedMS * 3.6);
      
      const timeOfArrivalHours = parseFloat((node.distanceKm / waveSpeedKmH).toFixed(2));
      
      // Calculate depth attenuation at current simulation hour
      let depth = 0;
      let velocity = 0;
      let status = 'SAFE';

      if (currentTime >= timeOfArrivalHours) {
        const timeSinceArrival = currentTime - timeOfArrivalHours;
        // Peak depth attenuation over distance: D(x) = D_0 * (x_0 / x)^0.5
        const initialDepth = 14.0; // meters near breach
        const maxNodeDepth = Math.max(0.8, initialDepth * Math.pow(10 / (node.distanceKm + 10), 0.6));
        
        // Dynamic depth curve over time at this node
        if (timeSinceArrival <= 3) {
          depth = maxNodeDepth * (timeSinceArrival / 3);
        } else {
          depth = maxNodeDepth * Math.exp(-0.15 * (timeSinceArrival - 3));
        }

        velocity = Math.min(12, Math.sqrt(this.gravity * depth) * 1.2);

        if (depth > 5) status = 'EXTREME DANGER';
        else if (depth > 2) status = 'HIGH RISK';
        else if (depth > 0.5) status = 'MODERATE';
        else status = 'ALERT';
      }

      return {
        ...node,
        timeOfArrivalHours,
        currentDepthM: parseFloat(depth.toFixed(2)),
        currentVelocityMS: parseFloat(velocity.toFixed(2)),
        status
      };
    });
  }
}

// Global physics engine instance
window.hydroEngine = new HydroEngine();
