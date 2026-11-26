import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Cargando from '@/shared/components/Cargando'
import type { Rol } from '@/features/usuarios/types/usuario'
import { useAuthStore } from '@/store/authStore'

interface Props {
  /** Roles que pueden entrar. Sin esta prop alcanza con tener sesión. */
  allowedRoles?: Rol[]
}

/** Sin sesión → /login; con sesión pero sin el rol → /unauthorized. Mientras se confirma la sesión muestra un indicador. */
export default function ProtectedRoute({ allowedRoles }: Props) {
  const usuario = useAuthStore((s) => s.usuario)
  const cargando = useAuthStore((s) => s.cargando)
  const location = useLocation()

  if (cargando) return <Cargando mensaje="Verificando sesión..." />
  if (!usuario) return <Navigate to="/login" replace state={{ from: location }} />
  if (allowedRoles && !allowedRoles.includes(usuario.role)) return <Navigate to="/unauthorized" replace />
  return <Outlet />
}
