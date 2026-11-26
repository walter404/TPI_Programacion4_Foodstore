from fastapi import APIRouter, Depends

from app.core.deps import require_role
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import UsuarioService, get_usuario_service

router = APIRouter(prefix="/admin/usuarios", tags=["Usuarios (admin)"])

solo_admin = require_role(["admin"])


@router.get("", response_model=list[UserPublic])
def listar_usuarios(
    _: Usuario = Depends(solo_admin),
    service: UsuarioService = Depends(get_usuario_service),
) -> list[UserPublic]:
    return service.listar()


@router.post("/{usuario_id}/activar", response_model=UserPublic)
def activar_usuario(
    usuario_id: int,
    _: Usuario = Depends(solo_admin),
    service: UsuarioService = Depends(get_usuario_service),
) -> UserPublic:
    return service.activar(usuario_id)


@router.post("/{usuario_id}/desactivar", response_model=UserPublic)
def desactivar_usuario(
    usuario_id: int,
    admin: Usuario = Depends(solo_admin),
    service: UsuarioService = Depends(get_usuario_service),
) -> UserPublic:
    return service.desactivar(usuario_id, admin.id)
