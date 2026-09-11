import uuid
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models.models import SimulationResultModel, SimulationModel, ExportJobModel
from backend.app.schemas.schemas import ExportRequest
from backend.app.services.exporter import DisasterReportExporter

router = APIRouter(prefix="/exports", tags=["Exports"])

@router.post("")
def create_export(payload: ExportRequest, db: Session = Depends(get_db)):
    result = db.query(SimulationResultModel).filter(SimulationResultModel.simulation_id == payload.simulation_id).first()
    sim = db.query(SimulationModel).filter(SimulationModel.id == payload.simulation_id).first()
    
    if not result or not sim:
        raise HTTPException(status_code=404, detail="Simulation result not found for export")

    export_id = f"exp-{uuid.uuid4().hex[:8]}"

    job = ExportJobModel(
        id=export_id,
        simulation_id=payload.simulation_id,
        format=payload.format.upper(),
        status="COMPLETED",
        download_url=f"/api/exports/download/{export_id}"
    )
    db.add(job)
    db.commit()

    return {
        "export_id": export_id,
        "simulation_id": payload.simulation_id,
        "format": payload.format,
        "status": "COMPLETED",
        "download_url": f"/api/exports/download/{export_id}"
    }

@router.get("/download/{export_id}")
def download_export(export_id: str, db: Session = Depends(get_db)):
    job = db.query(ExportJobModel).filter(ExportJobModel.id == export_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Export job not found")

    result = db.query(SimulationResultModel).filter(SimulationResultModel.simulation_id == job.simulation_id).first()
    sim = db.query(SimulationModel).filter(SimulationModel.id == job.simulation_id).first()

    sim_name = sim.name if sim else "Simulation"
    result_data = {
        "propagation_data": result.propagation_data if result else {},
        "hydrograph_data": result.hydrograph_data if result else {},
        "impact_metrics": result.impact_metrics if result else {}
    }

    fmt = job.format.upper()
    if fmt == "GEOJSON":
        content = DisasterReportExporter.generate_geojson(sim_name, result_data)
        return Response(
            content=content,
            media_type="application/geo+json",
            headers={"Content-Disposition": f"attachment; filename={export_id}_{sim_name.replace(' ', '_')}.geojson"}
        )
    elif fmt == "CSV":
        content = DisasterReportExporter.generate_csv(result_data)
        return Response(
            content=content,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={export_id}_hydrograph.csv"}
        )
    elif fmt == "KML":
        content = DisasterReportExporter.generate_kml(sim_name, result_data)
        return Response(
            content=content,
            media_type="application/vnd.google-earth.kml+xml",
            headers={"Content-Disposition": f"attachment; filename={export_id}_{sim_name.replace(' ', '_')}.kml"}
        )
    else:
        raise HTTPException(status_code=400, detail=f"Export format {fmt} is Integration Ready / PDF generation available via browser print.")
