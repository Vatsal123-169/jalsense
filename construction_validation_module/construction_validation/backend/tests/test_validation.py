import sys
from pathlib import Path
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.services.construction_validation_service import validate_construction_input

VALID_INPUT = {"damName": "Demo Valley Dam", "damHeightM": 45, "initialWaterLevelM": 40, "reservoirVolumeM3": 5_000_000, "reservoirSurfaceAreaM2": 250_000, "damLatitude": 30.5, "damLongitude": 78.3, "breachWidthM": 30, "breachDepthM": 20, "breachFormationTimeMin": 30, "dischargeCoefficientCd": 0.6, "simulationDurationMin": 120, "timeStepSec": 10, "scenarioName": "Moderate Breach"}

class ConstructionValidationTests(unittest.TestCase):
    def test_accepts_browser_camel_case_input(self):
        self.assertTrue(validate_construction_input(VALID_INPUT).is_valid)

    def test_rejects_water_higher_than_dam(self):
        response = validate_construction_input({**VALID_INPUT, "initialWaterLevelM": 46})
        self.assertFalse(response.is_valid)
        self.assertIn("cannot exceed", " ".join(response.errors))
        self.assertTrue(response.errors[0].startswith("input:"))

    def test_reports_soft_warning(self):
        response = validate_construction_input({**VALID_INPUT, "dischargeCoefficientCd": 0.2})
        self.assertTrue(response.is_valid)
        self.assertTrue(response.warnings)

if __name__ == "__main__":
    unittest.main()
