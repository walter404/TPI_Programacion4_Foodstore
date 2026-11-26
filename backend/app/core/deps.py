from collections.abc import Callable

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from app.core.database import get_session
from app.core.security import decode_access_token
from app.modules.usuarios.models import Usuario

COOKIE_NAME = "access_token"

# auto_error=False: la sesión normal viaja en la cookie; el header Bearer queda
# solo para poder probar desde el botón "Authorize" de /docs.
_oauth2_header = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token", auto_error=False)


def get_current_user(
    request: Request,
    header_token: str | None = Depends(_oauth2_header),
    session: Session = Depends(get_session),
) -> Usuario:
    """Lee la cookie HttpOnly, valida firma y expiración y carga el usuario. 401 si falla."""
    token = request.cookies.get(COOKIE_NAME) or header_token
    sin_sesion = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No autenticado")
    if not token:
        raise sin_sesion
    payload = decode_access_token(token)
    if payload is None or not payload.get("sub"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o vencido")
    usuario = session.exec(select(Usuario).where(Usuario.username == payload["sub"])).first()
    if usuario is None:
        raise sin_sesion
    return usuario


def get_current_active_user(usuario: Usuario = Depends(get_current_user)) -> Usuario:
    """400 si la cuenta está desactivada."""
    if usuario.disabled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cuenta de usuario desactivada")
    return usuario


def require_role(roles: list[str]) -> Callable[[Usuario], Usuario]:
    """Dependencia que exige sesión activa y uno de los roles indicados (403 si no)."""

    def verificar(usuario: Usuario = Depends(get_current_active_user)) -> Usuario:
        if usuario.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tenés permisos para esta acción")
        return usuario

    return verificar
