import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class VehicleDocument(SQLModel, table=True):
    __tablename__ = "vehicle_documents"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    vehicle_id: str = Field(foreign_key="vehicles.id", index=True)
    organization_id: str = Field(foreign_key="organizations.id", index=True)
    name: str = Field(max_length=255)
    type: str = Field(max_length=50)
    file_url: str = Field(max_length=500)
    file_size: int = Field(default=0)
    uploaded_by: str = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
