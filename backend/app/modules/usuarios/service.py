from fastapi import HTTPException, status

from app.core.security import hash_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class UsuarioService:
    """En usuarios y auth se admite lanzar HTTPException directo desde el Service."""

    def __init__(self, uow: UsuarioUnitOfWork) -> None:
        self.uow = uow

    def registrar(self, data: UserCreate, role: str = "user") -> UserPublic:
        with self.uow as uow:
            if uow.usuarios.get_by_username(data.username):
                raise HTTPException(status.HTTP_409_CONFLICT, "El nombre de usuario ya está en uso")
            if uow.usuarios.get_by_email(str(data.email)):
                raise HTTPException(status.HTTP_409_CONFLICT, "El email ya está registrado")
            usuario = Usuario(
                username=data.username,
                full_name=data.full_name.strip(),
                email=str(data.email).lower(),
                hashed_password=hash_password(data.password),
                role=role,
            )
            uow.usuarios.add(usuario)
            return UserPublic.model_validate(usuario)

    def listar(self) -> list[UserPublic]:
        with self.uow as uow:
            return [UserPublic.model_validate(u) for u in uow.usuarios.list_ordenados()]

    def _cambiar_estado(self, usuario_id: int, disabled: bool) -> UserPublic:
        with self.uow as uow:
            usuario = uow.usuarios.get_by_id(usuario_id)
            if usuario is None:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Usuario no encontrado")
            usuario.disabled = disabled  # idempotente: 200 aunque el estado no cambie
            uow.usuarios.add(usuario)
            return UserPublic.model_validate(usuario)

    def activar(self, usuario_id: int) -> UserPublic:
        return self._cambiar_estado(usuario_id, False)

    def desactivar(self, usuario_id: int, admin_id: int | None) -> UserPublic:
        if usuario_id == admin_id:
            # Se valida antes de abrir la transacción: no hace falta tocar la base.
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "No podés desactivarte a vos mismo")
        return self._cambiar_estado(usuario_id, True)


def get_usuario_service() -> UsuarioService:
    return UsuarioService(UsuarioUnitOfWork())
