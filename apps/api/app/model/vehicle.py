import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class Vehicle(SQLModel, table=True):
    __tablename__ = "vehicles"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    organization_id: str = Field(foreign_key="organizations.id", index=True)
    branch_id: Optional[str] = Field(default=None, foreign_key="branches.id", index=True)
    make: str = Field(max_length=100)
    model: str = Field(max_length=100)
    year: int
    vin: str = Field(max_length=17, index=True)
    mileage: int = Field(default=0)
    price: float = Field(default=0.0)
    cost: float = Field(default=0.0)
    color: str = Field(max_length=50)
    fuel_type: str = Field(max_length=30)
    transmission: str = Field(max_length=30)
    body_type: str = Field(max_length=30)
    engine_size: Optional[str] = Field(default=None, max_length=50)
    license_plate: Optional[str] = Field(default=None, max_length=20)
    status: str = Field(default="available", max_length=20, index=True)
    description: Optional[str] = Field(default=None)
    primary_photo_url: Optional[str] = Field(default=None, max_length=500)
    photos_count: int = Field(default=0)
    expenses_total: float = Field(default=0.0)
    purchased_at: Optional[datetime] = Field(default=None)
    sold_at: Optional[datetime] = Field(default=None)
    sold_price: Optional[float] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
