from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.model.user import User
from app.model.organization import Organization
from app.model.branch import Branch
from app.core.security import hash_password, verify_password, create_access_token


async def _build_user_response(session: AsyncSession, user: User) -> dict:
    org_name = None
    branch_name = None
    if user.organization_id:
        org_result = await session.exec(select(Organization).where(Organization.id == user.organization_id))
        org = org_result.first()
        if org:
            org_name = org.name
    if user.branch_id:
        branch_result = await session.exec(select(Branch).where(Branch.id == user.branch_id))
        branch = branch_result.first()
        if branch:
            branch_name = branch.name
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "organization_id": user.organization_id,
        "organization_name": org_name,
        "branch_id": user.branch_id,
        "branch_name": branch_name,
        "role": user.role,
        "avatar_url": user.avatar_url,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat(),
    }


async def authenticate_user(session: AsyncSession, email: str, password: str) -> dict:
    result = await session.exec(select(User).where(User.email == email))
    user = result.first()
    if not user or not verify_password(password, user.hashed_password):
        raise ValueError("Invalid credentials")
    token = create_access_token({"sub": user.id})
    user_response = await _build_user_response(session, user)
    return {"access_token": token, "user": user_response}


async def register_user(
    session: AsyncSession,
    full_name: str,
    email: str,
    password: str,
    organization_name: str,
) -> dict:
    existing = await session.exec(select(User).where(User.email == email))
    if existing.first():
        raise ValueError("Email already registered")
    org = Organization(name=organization_name)
    session.add(org)
    await session.flush()
    user = User(
        email=email,
        full_name=full_name,
        hashed_password=hash_password(password),
        organization_id=org.id,
        role="owner",
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    token = create_access_token({"sub": user.id})
    user_response = await _build_user_response(session, user)
    return {"access_token": token, "user": user_response}


async def get_current_user_response(session: AsyncSession, user: User) -> dict:
    return await _build_user_response(session, user)
