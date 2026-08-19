from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    organization_name: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    organization_id: str
    organization_name: Optional[str] = None
    branch_id: Optional[str] = None
    branch_name: Optional[str] = None
    role: str
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: str

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    access_token: str
    user: UserResponse
