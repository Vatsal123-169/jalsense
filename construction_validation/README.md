# Construction Validation

A runnable web interface and API for validating dam construction and breach simulation inputs.

## Run locally

From the workspace root:

```powershell
python -m pip install -r requirements.txt
.\start_local.ps1
```

Open http://127.0.0.1:8000 in a browser. The API endpoint is `POST /api/validate/construction` and accepts either camelCase (browser) or snake_case (Python) field names.

Alternatively, change into `construction_validation/backend` and run `python -m uvicorn app.main:app --reload`.

## Verify

```powershell
python -m unittest discover -s tests -v
```
