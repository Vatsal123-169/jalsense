import math
from typing import Dict, Any, List

class ReservoirModel:
    """
    Reservoir Storage & Differential Drainage Model.
    Tracks reservoir volume V(t), head level h(t), and water release differential dV/dt = -Q(t).
    """
    def __init__(self, gravity: float = 9.81):
        self.gravity = gravity

    def simulate_drainage(
        self,
        initial_volume_mcm: float,
        initial_water_level_m: float,
        surface_area_sqkm: float,
        peak_discharge_cms: float,
        breach_time_hours: float,
        simulation_duration_hours: float = 24.0,
        dt_minutes: float = 15.0
    ) -> List[Dict[str, Any]]:
        """
        Simulates discrete reservoir emptying over time.
        """
        dt_sec = dt_minutes * 60.0
        total_steps = int((simulation_duration_hours * 60.0) / dt_minutes)
        
        current_volume_m3 = initial_volume_mcm * 1e6
        initial_volume_m3 = current_volume_m3
        h0 = initial_water_level_m
        
        trajectory = []
        
        for step in range(total_steps + 1):
            t_hours = (step * dt_minutes) / 60.0
            
            # Fraction of reservoir emptied
            vol_ratio = max(0.0, current_volume_m3 / initial_volume_m3)
            current_head = h0 * math.sqrt(vol_ratio)
            
            # Approximate discharge fraction based on hydrograph curve
            if t_hours <= breach_time_hours:
                # Growth phase
                q_ratio = math.pow(t_hours / max(0.01, breach_time_hours), 2)
            else:
                # Decay phase
                decay_rate = 0.25 / max(0.1, breach_time_hours)
                q_ratio = math.exp(-decay_rate * (t_hours - breach_time_hours))
                
            q_out = max(50.0, peak_discharge_cms * q_ratio)
            
            trajectory.append({
                "time_hours": round(t_hours, 2),
                "volume_mcm": round(current_volume_m3 / 1e6, 2),
                "water_level_m": round(current_head, 2),
                "discharge_cms": round(q_out, 1)
            })
            
            # Volume reduction dV = Q * dt
            d_vol = q_out * dt_sec
            current_volume_m3 = max(0.0, current_volume_m3 - d_vol)
            
        return trajectory
