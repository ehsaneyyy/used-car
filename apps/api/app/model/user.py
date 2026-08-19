import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True)
    full_name: str = Field(max_length=255)
    hashed_password: str = Field(max_length=255)
    organization_id: str = Field(foreign_key="organizations.id", index=True)
    branch_id: Optional[str] = Field(default=None, foreign_key="branches.id", index=True)
    role: str = Field(default="staff", max_length=20)
    avatar_url: Optional[str] = Field(default=None, max_length=500)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
