from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.deps import get_current_user
from app.model.user import User
from app.service import vehicle_service

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


@router.get("")
async def list_vehicles(
    search: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    make: Optional[str] = Query(None),
    sort: Optional[str] = Query(None),
    order: str = Query("desc"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    return await vehicle_service.list_vehicles(
        session, current_user.organization_id,
        search=search, status=status_filter, make=make,
        sort=sort, order=order, page=page, per_page=per_page,
    )


@router.get("/{vehicle_id}")
async def get_vehicle(
    vehicle_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    vehicle = await vehicle_service.get_vehicle(session, vehicle_id, current_user.organization_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle.model_dump()


@router.post("")
async def create_vehicle(
    body: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    vehicle = await vehicle_service.create_vehicle(
        session, current_user.organization_id, current_user.branch_id, body
    )
    return vehicle.model_dump()


@router.patch("/{vehicle_id}")
async def update_vehicle(
    vehicle_id: str,
    body: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    vehicle = await vehicle_service.update_vehicle(session, vehicle_id, current_user.organization_id, body)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle.model_dump()


@router.delete("/{vehicle_id}")
async def delete_vehicle(
    vehicle_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    deleted = await vehicle_service.delete_vehicle(session, vehicle_id, current_user.organization_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"success": True}


@router.get("/{vehicle_id}/photos")
async def get_vehicle_photos(
    vehicle_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    return await vehicle_service.get_vehicle_photos(session, vehicle_id)


@router.post("/{vehicle_id}/photos")
async def upload_vehicle_photo(
    vehicle_id: str,
    body: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    photo = await vehicle_service.upload_vehicle_photo(
        session, vehicle_id, body.get("url", "#"), body.get("caption")
    )
    return photo.model_dump()


@router.delete("/{vehicle_id}/photos/{photo_id}")
async def delete_vehicle_photo(
    vehicle_id: str,
    photo_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    deleted = await vehicle_service.delete_vehicle_photo(session, vehicle_id, photo_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Photo not found")
    return {"success": True}


@router.get("/{vehicle_id}/status-history")
async def get_status_history(
    vehicle_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    return await vehicle_service.get_status_history(session, vehicle_id)


@router.patch("/{vehicle_id}/status")
async def update_vehicle_status(
    vehicle_id: str,
    body: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    updated = await vehicle_service.update_vehicle_status(
        session, vehicle_id, current_user.organization_id,
        current_user, body.get("status", ""), body.get("notes"),
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return {"success": True}
