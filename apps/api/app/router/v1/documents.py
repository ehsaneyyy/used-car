import math
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, func
from app.core.database import get_session
from app.core.deps import get_current_user
from app.model.user import User
from app.model.vehicle_document import VehicleDocument

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("")
async def list_documents(
    page: int = 1,
    per_page: int = 20,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    org_id = current_user.organization_id
    total_result = await session.exec(
        select(func.count()).select_from(VehicleDocument).where(VehicleDocument.organization_id == org_id)
    )
    total = total_result.one()

    result = await session.exec(
        select(VehicleDocument)
        .where(VehicleDocument.organization_id == org_id)
        .order_by(VehicleDocument.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    items = [d.model_dump() for d in result.all()]
    total_pages = math.ceil(total / per_page) if total > 0 else 1
    return {"items": items, "total": total, "page": page, "per_page": per_page, "total_pages": total_pages}


@router.post("")
async def upload_document(
    body: dict,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    doc = VehicleDocument(
        vehicle_id=body["vehicle_id"],
        organization_id=current_user.organization_id,
        name=body["name"],
        type=body.get("type", "pdf"),
        file_url=body.get("file_url", "#"),
        file_size=body.get("file_size", 0),
        uploaded_by=current_user.id,
    )
    session.add(doc)
    await session.commit()
    await session.refresh(doc)
    return doc.model_dump()


@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await session.exec(
        select(VehicleDocument)
        .where(VehicleDocument.id == document_id, VehicleDocument.organization_id == current_user.organization_id)
    )
    doc = result.first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    await session.delete(doc)
    await session.commit()
    return {"success": True}
