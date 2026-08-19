import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class VehicleStatusHistory(SQLModel, table=True):
    __tablename__ = "vehicle_status_history"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    vehicle_id: str = Field(foreign_key="vehicles.id", index=True)
    from_status: Optional[str] = Field(default=None, max_length=20)
    to_status: str = Field(max_length=20)
    changed_by: str = Field(foreign_key="users.id")
    changed_by_name: str = Field(max_length=255)
    notes: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
