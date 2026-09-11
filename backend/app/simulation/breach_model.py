import math
from typing import Dict, Any, Optional

class BreachModel:
    """
    Prototype Empirical Dam Breach Model
    Implements Froehlich (2008) and MacDonald & Langridge-Monopolis formulations.
    Calculates final breach width, breach formation time, and peak outflow discharge Q_peak.
    """
    def __init__(self, gravity: float = 9.81):
        self.gravity = gravity

    def calculate(
        self,
        dam_height_m: float,
        storage_volume_mcm: float,
        breach_width_m: Optional[float] = None,
        breach_depth_m: Optional[float] = None,
        breach_time_hours: Optional[float] = None,
        failure_mode: str = "overtopping",
        discharge_coeff: float = 0.6,
        base_inflow_cms: float = 150.0
    ) -> Dict[str, Any]:
        """
        Calculates dam breach parameters.
        :param dam_height_m: Height of dam in meters (m)
        :param storage_volume_mcm: Reservoir volume in Million Cubic Meters (MCM)
        :param breach_width_m: Optional user breach width override (m)
        :param breach_depth_m: Optional final breach depth (m)
        :param breach_time_hours: Optional user breach formation time override (hrs)
        :param failure_mode: 'overtopping' or 'piping'
        :param discharge_coeff: Cd breach discharge coefficient (0.5 to 0.8)
        :param base_inflow_cms: Base river inflow in m^3/s
        :return: Dict containing breach width, time, peak discharge Q_peak, and intermediate variables.
        """
        H = float(dam_height_m)
        V_m3 = float(storage_volume_mcm) * 1e6
        mode = failure_mode.lower()

        # Final Breach Depth default to 85% of dam height if not provided
        H_b = float(breach_depth_m) if breach_depth_m else H * 0.85

        # Froehlich (2008) Breach Width Estimation:
        # B_w = 0.027 * K_o * V^0.32 * H_b^0.19
        Ko = 1.3 if mode == "overtopping" else 1.0
        calc_breach_width = 0.027 * Ko * math.pow(V_m3, 0.32) * math.pow(H_b, 0.19)
        final_breach_width = float(breach_width_m) if breach_width_m and float(breach_width_m) > 0 else max(10.0, calc_breach_width)

        # Froehlich Breach Formation Time t_b (hours):
        # t_b = 0.0177 * V^0.53 * H^-0.90
        calc_time_hours = 0.0177 * math.pow(V_m3, 0.53) * math.pow(H, -0.9)
        final_time_hours = float(breach_time_hours) if breach_time_hours and float(breach_time_hours) > 0 else max(0.1, calc_time_hours)

        # Peak Discharge Q_peak (MacDonald & Langridge-Monopolis / Froehlich):
        # Q_peak = 0.607 * (Cd / 0.6) * V^0.295 * H^1.24
        Cd_factor = discharge_coeff / 0.6
        raw_Q_peak = 0.607 * Cd_factor * math.pow(V_m3, 0.295) * math.pow(H, 1.24)
        
        if mode == "piping":
            raw_Q_peak *= 0.85 # Piping outflow typically lower than sudden overtopping surge

        total_Q_peak = raw_Q_peak + float(base_inflow_cms)

        return {
            "dam_height_m": round(H, 2),
            "storage_volume_mcm": round(storage_volume_mcm, 2),
            "breach_width_m": round(final_breach_width, 1),
            "breach_depth_m": round(H_b, 1),
            "breach_time_hours": round(final_time_hours, 2),
            "discharge_coeff": discharge_coeff,
            "peak_discharge_cms": round(total_Q_peak, 1),
            "raw_breach_peak_cms": round(raw_Q_peak, 1),
            "base_inflow_cms": float(base_inflow_cms),
            "failure_mode": mode
        }
