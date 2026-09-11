import math
from typing import Dict, Any, List

class FloodPropagationModel:
    """
    1D/2D Hydraulic Wave Propagation & GIS Inundation Model.
    Calculates downstream wave arrival times, water depth attenuation D(x,t), flow velocity v(x,t),
    risk status, and dynamic buffer polygon coordinates for GIS map layers.
    """
    def __init__(self, gravity: float = 9.81):
        self.gravity = gravity

    def propagate(
        self,
        peak_discharge_cms: float,
        current_time_hours: float,
        river_path_coords: List[List[float]],
        downstream_nodes: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Calculates status at all downstream checkpoints and spatial inundation geometry at current_time_hours.
        """
        updated_nodes = []
        max_depth_all = 0.0

        for node in downstream_nodes:
            dist_km = float(node.get("distanceKm", node.get("distance_km", 10.0)))
            
            # Approximate wave celerity: dam break wave ~12 m/s near dam, slowing downstream
            wave_speed_ms = max(4.0, 12.0 - (dist_km * 0.12))
            wave_speed_kmh = wave_speed_ms * 3.6
            
            toa_hours = round(dist_km / wave_speed_kmh, 2)
            
            depth = 0.0
            velocity = 0.0
            status = "SAFE"
            
            if current_time_hours >= toa_hours:
                time_since_arrival = current_time_hours - toa_hours
                
                # Peak depth attenuation: D(x) = D_0 * (x_0 / (x + x_0))^0.6
                initial_depth = min(22.0, 10.0 + (peak_discharge_cms / 1000.0))
                max_node_depth = max(0.8, initial_depth * math.pow(10.0 / (dist_km + 10.0), 0.6))
                
                if time_since_arrival <= 3.0:
                    depth = max_node_depth * (time_since_arrival / 3.0)
                else:
                    depth = max_node_depth * math.exp(-0.15 * (time_since_arrival - 3.0))
                    
                velocity = min(14.0, math.sqrt(self.gravity * max(0.1, depth)) * 1.2)
                
                if depth > 5.0:
                    status = "EXTREME DANGER"
                elif depth > 2.0:
                    status = "HIGH RISK"
                elif depth > 0.5:
                    status = "MODERATE"
                else:
                    status = "ALERT"

            if depth > max_depth_all:
                max_depth_all = depth

            updated_nodes.append({
                "name": node.get("name", "Checkpoint"),
                "distanceKm": dist_km,
                "population": node.get("population", 0),
                "coords": node.get("coords", [0.0, 0.0]),
                "timeOfArrivalHours": toa_hours,
                "currentDepthM": round(depth, 2),
                "currentVelocityMS": round(velocity, 2),
                "status": status
            })

        # Calculate GIS Inundation Corridor Polygon
        polygon_coords = self._generate_inundation_polygon(
            river_path_coords,
            current_time_hours,
            peak_discharge_cms
        )

        return {
            "current_time_hours": current_time_hours,
            "nodes": updated_nodes,
            "max_water_depth_m": round(max_depth_all, 2),
            "inundation_polygon": polygon_coords
        }

    def _generate_inundation_polygon(
        self,
        river_path: List[List[float]],
        current_time_hours: float,
        peak_discharge_cms: float
    ) -> List[List[float]]:
        if not river_path or current_time_hours <= 0:
            return []

        # Reach along river path
        max_reach_km = current_time_hours * 18.0
        flooded_points = [river_path[0]]
        accumulated_dist = 0.0

        for i in range(1, len(river_path)):
            p1_lat, p1_lng = river_path[i - 1]
            p2_lat, p2_lng = river_path[i]
            
            # Approximate distance in km using equirectangular approximation
            dlat = (p2_lat - p1_lat) * 111.0
            dlng = (p2_lng - p1_lng) * 111.0 * math.cos(math.radians(p1_lat))
            segment_km = math.sqrt(dlat * dlat + dlng * dlng)

            if accumulated_dist + segment_km <= max_reach_km:
                flooded_points.append(river_path[i])
                accumulated_dist += segment_km
            else:
                ratio = (max_reach_km - accumulated_dist) / max(0.001, segment_km)
                lat = p1_lat + (p2_lat - p1_lat) * ratio
                lng = p1_lng + (p2_lng - p1_lng) * ratio
                flooded_points.append([lat, lng])
                break

        if len(flooded_points) < 2:
            return []

        # Build buffer banks (left and right)
        left_bank = []
        right_bank = []
        width_scale = min(3.5, 1.0 + (peak_discharge_cms / 4000.0))

        for idx, pt in enumerate(flooded_points):
            spread_deg = max(0.004, (0.025 * width_scale) - (idx * 0.0015))
            left_bank.append([round(pt[0] + spread_deg, 5), round(pt[1] - spread_deg * 0.8, 5)])
            right_bank.insert(0, [round(pt[0] - spread_deg, 5), round(pt[1] + spread_deg * 0.8, 5)])

        return left_bank + right_bank
