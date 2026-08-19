import math
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, func
from app.core.database import get_session
from app.core.deps import get_current_user
from app.model.user import User
from app.model.vehicle_expense import VehicleExpense

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get("")
async def list_expenses(
    page: int = 1,
    per_page: int = 20,
    category: str = None,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    org_id = current_user.organization_id
    query = select(VehicleExpense).where(VehicleExpense.organization_id == org_id)
    count_query = select(func.count()).select_from(VehicleExpense).where(VehicleExpense.organization_id == org_id)

    if category:
        query = query.where(VehicleExpense.category == category)
        count_query = count_query.where(VehicleExpense.category == category)

    total_result = await session.exec(count_query)
    total = total_result.one()

    result = await session.exec(
        query.order_by(VehicleExpense.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    items = [e.model_dump() for e in result.all()]
    total_pages = math.ceil(total / per_page) if total > 0 else 1
    return {"items": items, "total": total, "page": page, "per_page": per_page, "total_pages": total_pages}


@router.post("")
async def create_expense(
    body: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    expense = VehicleExpense(
        vehicle_id=body["vehicle_id"],
        organization_id=current_user.organization_id,
        category=body["category"],
        description=body["description"],
        amount=body["amount"],
        date=body["date"],
        vendor=body.get("vendor"),
        receipt_url=body.get("receipt_url"),
    )
    session.add(expense)
    await session.commit()
    await session.refresh(expense)
    return expense.model_dump()


@router.delete("/{expense_id}")
async def delete_expense(
    expense_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.exec(
        select(VehicleExpense)
        .where(VehicleExpense.id == expense_id, VehicleExpense.organization_id == current_user.organization_id)
    )
    expense = result.first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    await session.delete(expense)
    await session.commit()
    return {"success": True}
