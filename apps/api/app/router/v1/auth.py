from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_session
from app.core.deps import get_current_user
from app.model.user import User
from app.schema.auth import LoginRequest, RegisterRequest, AuthResponse, UserResponse
from app.service import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest, session: AsyncSession = Depends(get_session)):
    try:
        return await auth_service.authenticate_user(session, body.email, body.password)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/register", response_model=AuthResponse)
async def register(body: RegisterRequest, session: AsyncSession = Depends(get_session)):
    try:
        return await auth_service.register_user(
            session, body.full_name, body.email, body.password, body.organization_name
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def me(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    return await auth_service.get_current_user_response(session, current_user)
