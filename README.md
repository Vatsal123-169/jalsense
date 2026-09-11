# FLOODSIM

### Hydrodynamic Flood Simulation & Inundation Decision-Support Platform
**Smart India Hackathon 2026 • Problem Statement 26161**

---

## 🌊 Overview

**FLOODSIM** is an integrated geospatial decision-support platform designed for dam-break hydrodynamics, downstream wave propagation, and disaster management.

It allows disaster management authorities, hydrologists, and emergency responders to simulate dam breach scenarios, compute outflow hydrographs, model spatial flood inundation corridors, track settlement arrival times, compare alternative breach modes, and export standardized GIS reports.

---

## 🔬 Scientific Honesty Standard

> [!IMPORTANT]
> **Model Classification:**
> FLOODSIM runs an empirical dam breach model (Froehlich 2008 & MacDonald formulations) combined with 1D/2D shallow water wave attenuation.
> 
> The platform is explicitly designated as:
> * **"Prototype Decision-Support Model"**
> * **"Hydrodynamic Solver Integration Ready"** (Engineered to plug into validated 2D hydrodynamic solvers such as SPH / Delft3D).

---

## 🏗️ Technology Stack

### Frontend
* **Framework:** Next.js (App Router, TypeScript)
* **Styling:** Tailwind CSS (Glass/Command-center dark UI)
* **Mapping:** Leaflet GIS / CartoDB Dark Tiles
* **Charts:** Recharts (Outflow & Depth Profiles)
* **Icons:** Lucide React Icons

### Backend
* **Language:** Python 3.15
* **Framework:** FastAPI
* **Schemas:** Pydantic v2
* **ORM & DB:** SQLAlchemy with PostgreSQL / PostGIS (SQLite standalone fallback)
* **Job System:** In-Memory Async Job Runner / Redis Celery architecture hooks

---

## 📁 Repository Structure

```
sih-dambreak-simulator/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI Routers (simulations, scenarios, exports, data)
│   │   ├── core/         # Settings & Database Session
│   │   ├── models/       # SQLAlchemy ORM Models
│   │   ├── schemas/      # Pydantic Request/Response Schemas
│   │   ├── services/     # Job Runner & Disaster Report Exporter
│   │   └── simulation/   # Physics Engine (breach_model, reservoir_model, hydrograph, flood_propagation, metrics)
│   │   └── main.py       # FastAPI Entrypoint
│   ├── tests/            # pytest Unit Tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js App Router Pages (dashboard, simulation, scenarios, compare, satellite, data, exports, methodology, technology, team, architecture, settings)
│   │   ├── components/   # Leaflet MapViewer, Recharts Charts, Impact Metrics, Control Panel, Navbar, Footer
│   │   ├── lib/          # API Client & Offline Fallback Simulation Engine
│   │   └── types/        # TypeScript Interfaces
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 How to Run the Application

### 1. Run Backend (FastAPI Python Service)

```bash
cd backend
py -m pip install -r requirements.txt
py app/main.py
```
* Backend API will run at: `http://localhost:8000`
* Interactive API Documentation (Swagger Docs): `http://localhost:8000/docs`

### 2. Run Frontend (Next.js Application)

```bash
cd frontend
npm install
npm run dev
```
* Application will open at: `http://localhost:3000`

---

## 🧪 SIH 3–5 Minute Live Demonstration Walkthrough Script

1. **Landing Page:** Open `http://localhost:3000`. Show SIH 2026 PS 26161 banner and hero GIS visualizer.
2. **Launch Workspace:** Click **"Launch Simulation"** to navigate to `/simulation`.
3. **Preset Scenario Selection:** Select **"Rishi Ganga River Outburst (Uttarakhand)"**. Show structural height (48m), storage volume (65 MCM), and Froehlich breach width (120m).
4. **Trigger Simulation:** Adjust breach width slider to 160m. Click **"Run Simulation"**.
5. **Inspect Hydrograph:** Point out the Outflow Discharge Hydrograph $Q(t)$ showing peak outflow ($Q_{peak} \approx 4,850\,m^3/s$) and total volume released.
6. **Animate Flood Propagation:** Click **"Play Timeline"** or drag the timeline slider from T+0.0h to T+6.0h. Observe the spatial flood inundation corridor expanding along the river channel.
7. **Downstream Risk Markers:** Hover over settlement markers (Raini Village, Chamoli HQ) showing dynamic water depth ($m$), velocity ($m/s$), and wave arrival time ($T_a$).
8. **Disaster Telemetry:** Review Population at Risk (PAR), submerged town counts, and maximum inundation head.
9. **Scenario Comparison:** Navigate to `/compare`. Compare Moderate Breach (Scenario A) vs Extreme PMF Breach (Scenario B). Highlight the $+6.3\,km^2$ inundated area delta.
10. **Satellite Validation:** Open `/satellite`. Explain the Google Earth Engine (GEE Integration Ready) Sentinel-1 SAR spatial validation pipeline.
11. **Export GIS Data:** Navigate to `/exports` and click **"Download GeoJSON"** to generate spatial vector layers.
12. **Conclusion:** End with: *"FLOODSIM: Simulate the risk before it becomes a disaster."*
