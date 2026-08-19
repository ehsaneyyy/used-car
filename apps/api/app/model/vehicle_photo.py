import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class VehiclePhoto(SQLModel, table=True):
    __tablename__ = "vehicle_photos"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    vehicle_id: str = Field(foreign_key="vehicles.id", index=True)
    url: str = Field(max_length=500)
    caption: Optional[str] = Field(default=None, max_length=255)
    sort_order: int = Field(default=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
