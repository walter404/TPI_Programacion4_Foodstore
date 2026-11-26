from collections.abc import Callable
from types import TracebackType

from sqlmodel import Session

from app.core.database import session_factory


class UnitOfWork:
    """Una transacción por bloque `with`.

    - __enter__ abre la sesión y arma los repositorios (los define cada subclase).
    - __exit__ hace commit si no hubo excepción, rollback si la hubo, y siempre close.
    """

    session: Session

    def __init__(self, factory: Callable[[], Session] = session_factory) -> None:
        self._factory = factory

    def _init_repositories(self) -> None:
        """Las subclases crean acá sus repositorios, todos sobre la misma sesión."""

    def __enter__(self) -> "UnitOfWork":
        self.session = self._factory()
        self._init_repositories()
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        tb: TracebackType | None,
    ) -> None:
        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        finally:
            self.session.close()
