$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\construction_validation\backend"
python -m uvicorn app.main:app --reload
