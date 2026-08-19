from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.core.database import get_session
from app.core.deps import get_current_user
from app.core.security import hash_password
from app.model.user import User
from app.model.organization import Organization
from app.model.branch import Branch

router = APIRouter(tags=["settings"])


@router.get("/organizations/current")
async def get_organization(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.exec(select(Organization).where(Organization.id == current_user.organization_id))
    org = result.first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return org.model_dump()


@router.patch("/organizations/current")
async def update_organization(
    body: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.exec(select(Organization).where(Organization.id == current_user.organization_id))
    org = result.first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    for key, value in body.items():
        if hasattr(org, key) and value is not None:
            setattr(org, key, value)
    session.add(org)
    await session.commit()
    await session.refresh(org)
    return org.model_dump()


@router.get("/branches")
async def list_branches(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.exec(
        select(Branch).where(Branch.organization_id == current_user.organization_id).order_by(Branch.created_at)
    )
    return [b.model_dump() for b in result.all()]


@router.post("/branches")
async def create_branch(
    body: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    branch = Branch(
        organization_id=current_user.organization_id,
        name=body["name"],
        address=body.get("address"),
        phone=body.get("phone"),
        is_active=True,
    )
    session.add(branch)
    await session.commit()
    await session.refresh(branch)
    return branch.model_dump()


@router.patch("/branches/{branch_id}")
async def update_branch(
    branch_id: str,
    body: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.exec(
        select(Branch).where(Branch.id == branch_id, Branch.organization_id == current_user.organization_id)
    )
    branch = result.first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    for key, value in body.items():
        if hasattr(branch, key) and value is not None:
            setattr(branch, key, value)
    session.add(branch)
    await session.commit()
    await session.refresh(branch)
    return branch.model_dump()


@router.delete("/branches/{branch_id}")
async def delete_branch(
    branch_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.exec(
        select(Branch).where(Branch.id == branch_id, Branch.organization_id == current_user.organization_id)
    )
    branch = result.first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    await session.delete(branch)
    await session.commit()
    return {"success": True}


@router.get("/users")
async def list_users(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.exec(
        select(User).where(User.organization_id == current_user.organization_id).order_by(User.created_at)
    )
    users = []
    for u in result.all():
        branch_name = None
        if u.branch_id:
            br = await session.exec(select(Branch).where(Branch.id == u.branch_id))
            b = br.first()
            if b:
                branch_name = b.name
        org_result = await session.exec(select(Organization).where(Organization.id == u.organization_id))
        org = org_result.first()
        users.append({
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "organization_id": u.organization_id,
            "organization_name": org.name if org else None,
            "branch_id": u.branch_id,
            "branch_name": branch_name,
            "role": u.role,
            "avatar_url": u.avatar_url,
            "is_active": u.is_active,
            "created_at": u.created_at.isoformat(),
        })
    return users


@router.post("/users/invite")
async def invite_user(
    body: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    existing = await session.exec(select(User).where(User.email == body["email"]))
    if existing.first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=body["email"],
        full_name=body.get("full_name", body["email"].split("@")[0]),
        hashed_password=hash_password("Temp@123"),
        organization_id=current_user.organization_id,
        branch_id=body.get("branch_id"),
        role=body.get("role", "staff"),
        is_active=True,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    org_result = await session.exec(select(Organization).where(Organization.id == user.organization_id))
    org = org_result.first()
    branch_name = None
    if user.branch_id:
        br = await session.exec(select(Branch).where(Branch.id == user.branch_id))
        b = br.first()
        if b:
            branch_name = b.name
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "organization_id": user.organization_id,
        "organization_name": org.name if org else None,
        "branch_id": user.branch_id,
        "branch_name": branch_name,
        "role": user.role,
        "avatar_url": user.avatar_url,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat(),
    }


@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    body: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.exec(
        select(User).where(User.id == user_id, User.organization_id == current_user.organization_id)
    )
    user = result.first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = body["role"]
    session.add(user)
    await session.commit()
    return {"success": True}


@router.patch("/users/{user_id}/deactivate")
async def deactivate_user(
    user_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.exec(
        select(User).where(User.id == user_id, User.organization_id == current_user.organization_id)
    )
    user = result.first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    session.add(user)
    await session.commit()
    return {"success": True}
