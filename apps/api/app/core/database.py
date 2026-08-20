from collections.abc import AsyncGenerator
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlmodel import SQLModel
from app.core.config import settings


def _prepare_database_url(url: str) -> tuple[str, dict]:
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    needs_ssl = params.get("sslmode", [None])[0] not in (None, "disable")
    clean_url = urlunparse(parsed._replace(query=""))
    return clean_url, {"ssl": needs_ssl} if needs_ssl else {}


_db_url, _ssl_args = _prepare_database_url(settings.DATABASE_URL)

engine = create_async_engine(
    _db_url,
    pool_size=5,
    max_overflow=10,
    pool_recycle=300,
    connect_args=_ssl_args,
)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def create_db_and_tables() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

async def get_session() -> AsyncGenerator[AsyncSession,None]:
    async with async_session_factory() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
