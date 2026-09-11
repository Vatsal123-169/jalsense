import os

class Settings:
    PROJECT_NAME: str = "FLOODSIM - Hydrodynamic Decision-Support Platform"
    PROJECT_VERSION: str = "1.0.0-SIH2026"
    API_V1_STR: str = "/api"
    
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./floodsim.db" # Default SQLite DB for standalone zero-dependency execution
    )
    
    DEMO_MODE: bool = True
    SIH_PROBLEM_STATEMENT: str = "26161"

settings = Settings()
