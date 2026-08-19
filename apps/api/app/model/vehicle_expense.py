import uuid
from datetime import datetime, date, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class VehicleExpense(SQLModel, table=True):
    __tablename__ = "vehicle_expenses"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    vehicle_id: str = Field(foreign_key="vehicles.id", index=True)
    organization_id: str = Field(foreign_key="organizations.id", index=True)
    category: str = Field(max_length=30)
    description: str = Field(max_length=500)
    amount: float
    date: date
    vendor: Optional[str] = Field(default=None, max_length=255)
    receipt_url: Optional[str] = Field(default=None, max_length=500)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
