import { handleApiError } from '@/shared/api/handleApiError'
import Button from '@/shared/ui/Button'
import { useActivarUsuario, useDesactivarUsuario } from '../hooks/useUsuarios'
import type { Usuario } from '../types/usuario'

interface Props {
  usuario: Usuario
  /** id del admin que tiene la sesión abierta: a sí mismo no se puede desactivar. */
  miId: number | undefined
  onError: (mensaje: string | null) => void
}

/** Botón Activar o Desactivar de una fila de la tabla de usuarios. */
export default function AccionesUsuario({ usuario, miId, onError }: Props) {
  const activar = useActivarUsuario()
  const desactivar = useDesactivarUsuario()

  const ejecutar = (mutar: typeof activar.mutate) => {
    onError(null)
    mutar(usuario.id, { onError: (e) => onError(handleApiError(e)) })
  }

  if (usuario.disabled) {
    return (
      <Button variante="secundario" tamano="sm" disabled={activar.isPending} onClick={() => ejecutar(activar.mutate)}>
        Activar
      </Button>
    )
  }
  // El botón Desactivar no se muestra en la fila del usuario de la sesión.
  if (usuario.id === miId) return <span className="text-xs text-slate-400">Tu cuenta</span>
  return (
    <Button variante="peligro" tamano="sm" disabled={desactivar.isPending} onClick={() => ejecutar(desactivar.mutate)}>
      Desactivar
    </Button>
  )
}
