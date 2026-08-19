import math
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, func, col
from app.core.database import get_session
from app.core.deps import get_current_user
from app.model.user import User
from app.model.vehicle import Vehicle
from app.model.vehicle_expense import VehicleExpense
from app.model.vehicle_purchase import VehiclePurchase
from app.model.vehicle_status_history import VehicleStatusHistory

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats")
async def get_stats(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    org_id = current_user.organization_id

    total_result = await session.exec(
        select(func.count()).select_from(Vehicle).where(Vehicle.organization_id == org_id)
    )
    total_vehicles = total_result.one()

    active_result = await session.exec(
        select(func.count()).select_from(Vehicle)
        .where(Vehicle.organization_id == org_id, Vehicle.status == "available")
    )
    active_vehicles = active_result.one()

    sold_result = await session.exec(
        select(func.count()).select_from(Vehicle)
        .where(Vehicle.organization_id == org_id, Vehicle.status == "sold")
    )
    sold_vehicles = sold_result.one()

    reserved_result = await session.exec(
        select(func.count()).select_from(Vehicle)
        .where(Vehicle.organization_id == org_id, Vehicle.status == "reserved")
    )
    reserved_vehicles = reserved_result.one()

    revenue_result = await session.exec(
        select(func.coalesce(func.sum(Vehicle.sold_price), 0.0))
        .where(Vehicle.organization_id == org_id, Vehicle.sold_price.isnot(None))
    )
    total_revenue = float(revenue_result.one())

    expenses_result = await session.exec(
        select(func.coalesce(func.sum(VehicleExpense.amount), 0.0))
        .where(VehicleExpense.organization_id == org_id)
    )
    total_expenses = float(expenses_result.one())

    purchases_result = await session.exec(
        select(func.coalesce(func.sum(VehiclePurchase.purchase_price), 0.0))
        .where(VehiclePurchase.organization_id == org_id)
    )
    total_purchases = float(purchases_result.one())

    return {
        "total_vehicles": total_vehicles,
        "active_vehicles": active_vehicles,
        "sold_vehicles": sold_vehicles,
        "reserved_vehicles": reserved_vehicles,
        "total_revenue": total_revenue,
        "total_expenses": total_expenses,
        "total_purchases": total_purchases,
        "monthly_revenue": total_revenue,
    }


@router.get("/monthly")
async def get_monthly_data(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    org_id = current_user.organization_id
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    expenses_result = await session.exec(
        select(VehicleExpense).where(VehicleExpense.organization_id == org_id)
    )
    expenses = expenses_result.all()

    purchases_result = await session.exec(
        select(VehiclePurchase).where(VehiclePurchase.organization_id == org_id)
    )
    purchases = purchases_result.all()

    sales_result = await session.exec(
        select(Vehicle).where(Vehicle.organization_id == org_id, Vehicle.sold_price.isnot(None))
    )
    sales = sales_result.all()

    monthly = []
    for i, month_name in enumerate(months[:8]):
        month_expenses = sum(e.amount for e in expenses if e.date.month == i + 1)
        month_purchases = sum(p.purchase_price for p in purchases if p.purchase_date.month == i + 1)
        month_revenue = sum(v.sold_price for v in sales if v.sold_at and v.sold_at.month == i + 1)
        monthly.append({
            "month": month_name,
            "revenue": month_revenue,
            "expenses": month_expenses,
            "purchases": month_purchases,
        })
    return monthly


@router.get("/activity")
async def get_recent_activity(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    org_id = current_user.organization_id

    history_result = await session.exec(
        select(VehicleStatusHistory)
        .join(Vehicle, Vehicle.id == VehicleStatusHistory.vehicle_id)
        .where(Vehicle.organization_id == org_id)
        .order_by(VehicleStatusHistory.created_at.desc())
        .limit(10)
    )
    histories = history_result.all()

    purchase_result = await session.exec(
        select(VehiclePurchase)
        .where(VehiclePurchase.organization_id == org_id)
        .order_by(VehiclePurchase.created_at.desc())
        .limit(5)
    )
    purchases = purchase_result.all()

    activities = []
    for h in histories:
        activities.append({
            "id": h.id,
            "type": "status_change",
            "description": f"Vehicle status changed to {h.to_status}",
            "vehicle_info": h.notes,
            "created_at": h.created_at.isoformat(),
        })
    for p in purchases:
        activities.append({
            "id": p.id,
            "type": "purchase",
            "description": f"Purchase recorded from {p.seller_name}",
            "amount": p.purchase_price,
            "created_at": p.created_at.isoformat(),
        })

    activities.sort(key=lambda a: a["created_at"], reverse=True)
    return activities[:10]
