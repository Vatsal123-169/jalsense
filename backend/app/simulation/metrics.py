from typing import Dict, Any, List

class ImpactMetricsCalculator:
    """
    Calculates summary disaster metrics and risk statistics from simulation results.
    """
    @staticmethod
    def calculate_impact(
        nodes_state: List[Dict[str, Any]],
        current_time_hours: float,
        peak_discharge_cms: float,
        total_released_mcm: float
    ) -> Dict[str, Any]:
        total_par = 0
        submerged_settlements = 0
        max_depth = 0.0
        earliest_arrival = 999.0

        for node in nodes_state:
            toa = float(node.get("timeOfArrivalHours", 999.0))
            if toa < earliest_arrival:
                earliest_arrival = toa

            depth = float(node.get("currentDepthM", 0.0))
            if current_time_hours >= toa and depth > 0.1:
                total_par += int(node.get("population", 0))
                submerged_settlements += 1
                if depth > max_depth:
                    max_depth = depth

        # Dynamic inundated area (sq km) estimation
        area_sqkm = round(min(280.0, current_time_hours * 3.4 * (peak_discharge_cms / 4500.0)), 1) if current_time_hours > 0 else 0.0

        risk_level = "LOW"
        if submerged_settlements >= 3 or max_depth > 4.0:
            risk_level = "CRITICAL / SEVERE"
        elif submerged_settlements >= 1 or max_depth > 1.5:
            risk_level = "MODERATE / HIGH"

        return {
            "population_at_risk": total_par,
            "affected_settlements_count": submerged_settlements,
            "total_settlements_monitored": len(nodes_state),
            "inundated_area_sqkm": area_sqkm,
            "maximum_water_depth_m": round(max_depth, 2),
            "earliest_arrival_hours": round(earliest_arrival, 2) if earliest_arrival != 999.0 else 0.0,
            "peak_discharge_cms": round(peak_discharge_cms, 1),
            "total_released_volume_mcm": round(total_released_mcm, 2),
            "overall_risk_level": risk_level
        }
