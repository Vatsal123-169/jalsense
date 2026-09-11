import math
from typing import Dict, Any, List

class HydrographGenerator:
    """
    Generates time-series Breach Outflow Hydrographs Q(t) in m^3/s.
    Computes peak discharge, time to peak, and total released volume.
    """
    @staticmethod
    def generate(
        peak_discharge_cms: float,
        breach_time_hours: float,
        base_inflow_cms: float = 150.0,
        duration_hours: float = 24.0,
        time_step_hours: float = 0.5
    ) -> Dict[str, Any]:
        points = []
        t_peak = max(0.1, breach_time_hours)
        total_released_m3 = 0.0

        t = 0.0
        dt_sec = time_step_hours * 3600.0

        while t <= duration_hours:
            if t <= t_peak:
                # Rising limb (quadratic growth)
                q = base_inflow_cms + (peak_discharge_cms - base_inflow_cms) * math.pow(t / t_peak, 2)
            else:
                # Falling limb (exponential recession)
                decay_rate = 0.25 / t_peak
                q = base_inflow_cms + (peak_discharge_cms - base_inflow_cms) * math.exp(-decay_rate * (t - t_peak))

            q_rounded = round(q, 1)
            points.append({
                "time_hours": round(t, 2),
                "discharge_cms": q_rounded
            })

            total_released_m3 += q * dt_sec
            t += time_step_hours

        total_released_mcm = round(total_released_m3 / 1e6, 2)

        return {
            "time_series": points,
            "peak_discharge_cms": round(peak_discharge_cms, 1),
            "time_to_peak_hours": round(t_peak, 2),
            "total_released_volume_mcm": total_released_mcm,
            "base_inflow_cms": base_inflow_cms
        }
