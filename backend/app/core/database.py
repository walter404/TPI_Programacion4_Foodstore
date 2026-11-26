from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

# SQLite necesita este argumento para usarse desde distintos hilos (solo desarrollo local).
_connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(settings.DATABASE_URL, connect_args=_connect_args)


def session_factory() -> Session:
    """Crea una sesión nueva. La usan los Unit of Work."""
    return Session(engine)


def get_session() -> Generator[Session, None, None]:
    """Dependencia de FastAPI para los módulos auth y usuarios (sesión por petición)."""
    with Session(engine) as session:
        yield session


def create_all_tables() -> None:
    # Importar los modelos registra las tablas en SQLModel.metadata
    from app.modules.categorias import models as _categorias  # noqa: F401
    from app.modules.pedidos import models as _pedidos  # noqa: F401
    from app.modules.productos import models as _productos  # noqa: F401
    from app.modules.usuarios import models as _usuarios  # noqa: F401

    SQLModel.metadata.create_all(engine)
