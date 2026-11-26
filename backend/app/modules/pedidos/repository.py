from datetime import datetime

from sqlalchemy import func
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import DetallePedido, Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Pedido)

    def add_detalle(self, detalle: DetallePedido) -> DetallePedido:
        self.session.add(detalle)
        self.session.flush()
        return detalle

    def refresh(self, pedido: Pedido) -> None:
        """Recarga el pedido (y sus líneas) después de insertar los detalles."""
        self.session.refresh(pedido)

    def _listar(self, usuario_id: int | None, estado: str | None, skip: int, limit: int) -> tuple[list[Pedido], int]:
        condiciones = []
        if usuario_id is not None:
            condiciones.append(Pedido.usuario_id == usuario_id)
        if estado:
            condiciones.append(Pedido.estado == estado)
        total = self.session.exec(select(func.count()).select_from(Pedido).where(*condiciones)).one()
        items = self.session.exec(
            select(Pedido).where(*condiciones).order_by(Pedido.id.desc()).offset(skip).limit(limit)  # type: ignore[attr-defined]
        ).all()
        return list(items), int(total)

    def list_by_usuario(
        self, usuario_id: int, estado: str | None = None, skip: int = 0, limit: int = 20
    ) -> tuple[list[Pedido], int]:
        return self._listar(usuario_id, estado, skip, limit)

    def list_all(self, estado: str | None = None, skip: int = 0, limit: int = 20) -> tuple[list[Pedido], int]:
        return self._listar(None, estado, skip, limit)

    def count_by_estado(self) -> dict[str, int]:
        filas = self.session.exec(select(Pedido.estado, func.count()).group_by(Pedido.estado)).all()
        return {estado: int(cantidad) for estado, cantidad in filas}

    def count_desde(self, desde: datetime) -> int:
        return int(self.session.exec(select(func.count()).select_from(Pedido).where(Pedido.created_at >= desde)).one())

    def sum_total_by_estado(self, estado: str) -> float:
        suma = self.session.exec(select(func.coalesce(func.sum(Pedido.total), 0)).where(Pedido.estado == estado)).one()
        return float(suma)
