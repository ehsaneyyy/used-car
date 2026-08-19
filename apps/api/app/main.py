from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import create_db_and_tables
from app.model import (
    Organization, Branch, User, Vehicle, VehiclePhoto,
    VehicleExpense, VehicleDocument, VehicleStatusHistory, VehiclePurchase,
)
from app.router.v1.auth import router as auth_router
from app.router.v1.vehicles import router as vehicles_router
from app.router.v1.dashboard import router as dashboard_router
from app.router.v1.purchases import router as purchases_router
from app.router.v1.expenses import router as expenses_router
from app.router.v1.documents import router as documents_router
from app.router.v1.settings import router as settings_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield


app = FastAPI(title="DoDealers API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(vehicles_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(purchases_router, prefix="/api/v1")
app.include_router(expenses_router, prefix="/api/v1")
app.include_router(documents_router, prefix="/api/v1")
app.include_router(settings_router, prefix="/api/v1")


@app.get("/api/v1/health")
async def health():
    return {"status": "ok"}
