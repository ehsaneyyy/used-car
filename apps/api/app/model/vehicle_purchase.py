import uuid
from datetime import datetime, date, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class VehiclePurchase(SQLModel, table=True):
    __tablename__ = "vehicle_purchases"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    vehicle_id: str = Field(foreign_key="vehicles.id", index=True)
    organization_id: str = Field(foreign_key="organizations.id", index=True)
    seller_name: str = Field(max_length=255)
    seller_phone: Optional[str] = Field(default=None, max_length=50)
    seller_email: Optional[str] = Field(default=None, max_length=255)
    purchase_price: float
    purchase_date: date
    notes: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
