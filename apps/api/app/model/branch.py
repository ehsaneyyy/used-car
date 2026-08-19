import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class Branch(SQLModel, table=True):
    __tablename__ = "branches"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    organization_id: str = Field(foreign_key="organizations.id", index=True)
    name: str = Field(max_length=255)
    address: Optional[str] = Field(default=None, max_length=500)
    phone: Optional[str] = Field(default=None, max_length=50)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
