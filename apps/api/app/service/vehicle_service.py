import math
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, func, col
from app.model.vehicle import Vehicle
from app.model.vehicle_photo import VehiclePhoto
from app.model.vehicle_status_history import VehicleStatusHistory
from app.model.user import User


async def list_vehicles(
    session: AsyncSession,
    organization_id: str,
    search: Optional[str] = None,
    status: Optional[str] = None,
    make: Optional[str] = None,
    sort: Optional[str] = None,
    order: str = "desc",
    page: int = 1,
    per_page: int = 20,
) -> dict:
    query = select(Vehicle).where(Vehicle.organization_id == organization_id)
    count_query = select(func.count()).select_from(Vehicle).where(Vehicle.organization_id == organization_id)

    if search:
        q = f"%{search}%"
        search_filter = (
            col(Vehicle.make).ilike(q)
            | col(Vehicle.model).ilike(q)
            | col(Vehicle.vin).ilike(q)
            | col(Vehicle.color).ilike(q)
        )
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    if status:
        query = query.where(Vehicle.status == status)
        count_query = count_query.where(Vehicle.status == status)

    if make:
        query = query.where(col(Vehicle.make).ilike(make))
        count_query = count_query.where(col(Vehicle.make).ilike(make))

    total_result = await session.exec(count_query)
    total = total_result.one()

    sort_column = getattr(Vehicle, sort, None) if sort else Vehicle.created_at
    if order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await session.exec(query)
    items = [v.model_dump() for v in result.all()]

    total_pages = math.ceil(total / per_page) if total > 0 else 1
    return {
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
    }


async def get_vehicle(session: AsyncSession, vehicle_id: str, organization_id: str) -> Optional[Vehicle]:
    result = await session.exec(
        select(Vehicle).where(Vehicle.id == vehicle_id, Vehicle.organization_id == organization_id)
    )
    return result.first()


async def create_vehicle(session: AsyncSession, organization_id: str, branch_id: Optional[str], data: dict) -> Vehicle:
    vehicle = Vehicle(
        organization_id=organization_id,
        branch_id=branch_id,
        **data,
    )
    session.add(vehicle)
    await session.commit()
    await session.refresh(vehicle)
    return vehicle


async def update_vehicle(session: AsyncSession, vehicle_id: str, organization_id: str, data: dict) -> Optional[Vehicle]:
    result = await session.exec(
        select(Vehicle).where(Vehicle.id == vehicle_id, Vehicle.organization_id == organization_id)
    )
    vehicle = result.first()
    if not vehicle:
        return None
    for key, value in data.items():
        if hasattr(vehicle, key) and value is not None:
            setattr(vehicle, key, value)
    vehicle.updated_at = datetime.now(timezone.utc)
    session.add(vehicle)
    await session.commit()
    await session.refresh(vehicle)
    return vehicle


async def delete_vehicle(session: AsyncSession, vehicle_id: str, organization_id: str) -> bool:
    result = await session.exec(
        select(Vehicle).where(Vehicle.id == vehicle_id, Vehicle.organization_id == organization_id)
    )
    vehicle = result.first()
    if not vehicle:
        return False
    await session.delete(vehicle)
    await session.commit()
    return True


async def get_vehicle_photos(session: AsyncSession, vehicle_id: str) -> list:
    result = await session.exec(
        select(VehiclePhoto).where(VehiclePhoto.vehicle_id == vehicle_id).order_by(VehiclePhoto.sort_order)
    )
    return [p.model_dump() for p in result.all()]


async def upload_vehicle_photo(session: AsyncSession, vehicle_id: str, url: str, caption: Optional[str] = None) -> VehiclePhoto:
    result = await session.exec(select(func.count()).select_from(VehiclePhoto).where(VehiclePhoto.vehicle_id == vehicle_id))
    count = result.one()
    photo = VehiclePhoto(vehicle_id=vehicle_id, url=url, caption=caption, sort_order=count)
    session.add(photo)

    vehicle_result = await session.exec(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = vehicle_result.first()
    if vehicle:
        vehicle.photos_count = (vehicle.photos_count or 0) + 1
        session.add(vehicle)

    await session.commit()
    await session.refresh(photo)
    return photo


async def delete_vehicle_photo(session: AsyncSession, vehicle_id: str, photo_id: str) -> bool:
    result = await session.exec(
        select(VehiclePhoto).where(VehiclePhoto.id == photo_id, VehiclePhoto.vehicle_id == vehicle_id)
    )
    photo = result.first()
    if not photo:
        return False
    await session.delete(photo)

    vehicle_result = await session.exec(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = vehicle_result.first()
    if vehicle and vehicle.photos_count > 0:
        vehicle.photos_count -= 1
        session.add(vehicle)

    await session.commit()
    return True


async def get_status_history(session: AsyncSession, vehicle_id: str) -> list:
    result = await session.exec(
        select(VehicleStatusHistory)
        .where(VehicleStatusHistory.vehicle_id == vehicle_id)
        .order_by(VehicleStatusHistory.created_at.desc())
    )
    return [h.model_dump() for h in result.all()]


async def update_vehicle_status(
    session: AsyncSession,
    vehicle_id: str,
    organization_id: str,
    user: User,
    new_status: str,
    notes: Optional[str] = None,
) -> bool:
    result = await session.exec(
        select(Vehicle).where(Vehicle.id == vehicle_id, Vehicle.organization_id == organization_id)
    )
    vehicle = result.first()
    if not vehicle:
        return False
    old_status = vehicle.status
    vehicle.status = new_status
    vehicle.updated_at = datetime.now(timezone.utc)
    if new_status == "sold":
        vehicle.sold_at = datetime.now(timezone.utc)
    session.add(vehicle)

    history = VehicleStatusHistory(
        vehicle_id=vehicle_id,
        from_status=old_status,
        to_status=new_status,
        changed_by=user.id,
        changed_by_name=user.full_name,
        notes=notes,
    )
    session.add(history)
    await session.commit()
    return True
