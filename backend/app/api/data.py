import uuid
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List

from backend.app.core.database import get_db
from backend.app.models.models import DatasetModel

router = APIRouter(prefix="/data", tags=["Datasets"])

@router.get("")
def list_datasets(db: Session = Depends(get_db)):
    datasets = db.query(DatasetModel).all()
    if not datasets:
        return seed_default_datasets(db)
    return datasets

@router.post("/upload")
async def upload_dataset(
    name: str = Form(...),
    data_type: str = Form(...), # DEM, River, Dam, Satellite
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    dataset_id = f"ds-{uuid.uuid4().hex[:8]}"
    content = await file.read()
    size_mb = round(len(content) / (1024 * 1024), 2)
    
    ext = file.filename.split(".")[-1].upper() if "." in file.filename else "UNKNOWN"

    ds = DatasetModel(
        id=dataset_id,
        name=name,
        data_type=data_type,
        format=ext,
        size_mb=max(0.1, size_mb),
        status="ACTIVE"
    )
    db.add(ds)
    db.commit()
    db.refresh(ds)
    return ds

def seed_default_datasets(db: Session):
    defaults = [
        {"id": "ds-dem-uttarakhand", "name": "SRTM 30m DEM - Rishi Ganga River Basin", "data_type": "DEM", "format": "GeoTIFF", "size_mb": 42.5, "status": "ACTIVE"},
        {"id": "ds-river-teesta", "name": "Teesta River High-Res Vector Channel", "data_type": "River", "format": "GeoJSON", "size_mb": 4.2, "status": "ACTIVE"},
        {"id": "ds-dam-registry", "name": "CWC National Register of Large Dams (NRLD 2026)", "data_type": "Dam", "format": "CSV", "size_mb": 12.8, "status": "ACTIVE"},
        {"id": "ds-sat-sentinel1", "name": "Sentinel-1 SAR Post-Disaster Flood Mask (Sikkim)", "data_type": "Satellite", "format": "GeoTIFF", "size_mb": 115.0, "status": "ACTIVE"}
    ]
    seeded = []
    for d in defaults:
        ds = DatasetModel(**d)
        db.add(ds)
        seeded.append(ds)
    db.commit()
    return seeded
