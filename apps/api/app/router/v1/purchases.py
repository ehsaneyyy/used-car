import math
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, func
from app.core.database import get_session
from app.core.deps import get_current_user
from app.model.user import User
from app.model.vehicle_purchase import VehiclePurchase

router = APIRouter(prefix="/purchases", tags=["purchases"])


@router.get("")
async def list_purchases(
    page: int = 1,
    per_page: int = 20,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    org_id = current_user.organization_id
    total_result = await session.exec(
        select(func.count()).select_from(VehiclePurchase).where(VehiclePurchase.organization_id == org_id)
    )
    total = total_result.one()

    result = await session.exec(
        select(VehiclePurchase)
        .where(VehiclePurchase.organization_id == org_id)
        .order_by(VehiclePurchase.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    items = [p.model_dump() for p in result.all()]
    total_pages = math.ceil(total / per_page) if total > 0 else 1
    return {"items": items, "total": total, "page": page, "per_page": per_page, "total_pages": total_pages}


@router.post("")
async def create_purchase(
    body: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    purchase = VehiclePurchase(
        vehicle_id=body["vehicle_id"],
        organization_id=current_user.organization_id,
        seller_name=body["seller_name"],
        seller_phone=body.get("seller_phone"),
        seller_email=body.get("seller_email"),
        purchase_price=body["purchase_price"],
        purchase_date=body["purchase_date"],
        notes=body.get("notes"),
    )
    session.add(purchase)
    await session.commit()
    await session.refresh(purchase)
    return purchase.model_dump()


@router.delete("/{purchase_id}")
async def delete_purchase(
    purchase_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.exec(
        select(VehiclePurchase)
        .where(VehiclePurchase.id == purchase_id, VehiclePurchase.organization_id == current_user.organization_id)
    )
    purchase = result.first()
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    await session.delete(purchase)
    await session.commit()
    return {"success": True}
