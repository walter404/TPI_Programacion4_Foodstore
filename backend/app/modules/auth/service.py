from fastapi import HTTPException, status

from app.core.security import create_access_token, verify_password
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class AuthService:
    """Auth usa el modelo Usuario: no tiene modelo ni repositorio propios."""

    def __init__(self, uow: UsuarioUnitOfWork) -> None:
        self.uow = uow

    def login(self, username: str, password: str) -> str:
        """Valida las credenciales y devuelve el JWT (que el router pone en la cookie)."""
        with self.uow as uow:
            usuario: Usuario | None = uow.usuarios.get_by_username(username)
            if usuario is None and "@" in username:
                usuario = uow.usuarios.get_by_email(username.lower())
            if usuario is None or not verify_password(password, usuario.hashed_password):
                raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Usuario o contraseña incorrectos")
            if usuario.disabled:
                raise HTTPException(status.HTTP_400_BAD_REQUEST, "Cuenta de usuario desactivada")
            return create_access_token({"sub": usuario.username})


def get_auth_service() -> AuthService:
    return AuthService(UsuarioUnitOfWork())
