import axios from 'axios'

interface ErrorDeValidacion {
  msg?: string
  loc?: (string | number)[]
}

/** Convierte el `detail` que devuelve la API en un mensaje para mostrar en pantalla. */
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'No se pudo conectar con el servidor. ¿Está corriendo el backend?'
    const detail: unknown = (error.response.data as { detail?: unknown } | undefined)?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      const mensajes = (detail as ErrorDeValidacion[])
        .map((d) => (d.loc ? `${d.loc[d.loc.length - 1]}: ${d.msg ?? 'inválido'}` : (d.msg ?? 'inválido')))
        .join(' · ')
      return `Datos inválidos — ${mensajes}`
    }
    return `Error ${error.response.status}`
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado'
}
