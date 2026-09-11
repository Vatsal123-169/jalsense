import json
import csv
import io
from typing import Dict, Any

class DisasterReportExporter:
    """
    Generates real downloadable export payloads: GeoJSON, CSV, KML, and HTML/PDF summary reports.
    """
    @staticmethod
    def generate_geojson(simulation_name: str, result_data: Dict[str, Any]) -> str:
        propagation = result_data.get("propagation_data", {})
        poly_coords = propagation.get("inundation_polygon", [])
        nodes = propagation.get("nodes", [])

        features = []

        # Feature 1: Dynamic Flood Inundation Polygon
        if poly_coords and len(poly_coords) > 2:
            # Reformat to [lng, lat] for standard GeoJSON
            geojson_poly = [[pt[1], pt[0]] for pt in poly_coords]
            geojson_poly.append(geojson_poly[0]) # Close loop

            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [geojson_poly]
                },
                "properties": {
                    "layer": "Flood Inundation Corridor",
                    "simulation": simulation_name,
                    "max_depth_m": propagation.get("max_water_depth_m", 0.0),
                    "status": "INUNDATED"
                }
            })

        # Feature set 2: Settlement Checkpoints
        for node in nodes:
            coords = node.get("coords", [0, 0])
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [coords[1], coords[0]]
                },
                "properties": {
                    "name": node.get("name"),
                    "distance_km": node.get("distanceKm"),
                    "population": node.get("population"),
                    "arrival_time_hrs": node.get("timeOfArrivalHours"),
                    "depth_m": node.get("currentDepthM"),
                    "velocity_ms": node.get("currentVelocityMS"),
                    "status": node.get("status")
                }
            })

        feature_collection = {
            "type": "FeatureCollection",
            "name": f"FLOODSIM_{simulation_name.replace(' ', '_')}",
            "crs": {
                "type": "name",
                "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}
            },
            "features": features
        }

        return json.dumps(feature_collection, indent=2)

    @staticmethod
    def generate_csv(result_data: Dict[str, Any]) -> str:
        hydrograph = result_data.get("hydrograph_data", {})
        time_series = hydrograph.get("time_series", [])

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Time_Hours", "Discharge_m3_per_sec"])

        for pt in time_series:
            writer.writerow([pt.get("time_hours"), pt.get("discharge_cms")])

        return output.getvalue()

    @staticmethod
    def generate_kml(simulation_name: str, result_data: Dict[str, Any]) -> str:
        propagation = result_data.get("propagation_data", {})
        poly_coords = propagation.get("inundation_polygon", [])
        
        poly_str = " ".join([f"{pt[1]},{pt[0]},0" for pt in poly_coords])

        kml = f"""<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>FLOODSIM - {simulation_name}</name>
    <description>Simulated Dam Breach Inundation Zone</description>
    <Style id="floodPoly">
      <LineStyle><color>ff5c3bff</color><width>2</width></LineStyle>
      <PolyStyle><color>7f5c3bff</color></PolyStyle>
    </Style>
    <Placemark>
      <name>Inundation Zone</name>
      <styleUrl>#floodPoly</styleUrl>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>{poly_str}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>"""
        return kml
