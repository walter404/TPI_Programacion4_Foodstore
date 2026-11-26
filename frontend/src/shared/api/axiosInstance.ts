import axios from 'axios'

/** Cliente HTTP único. `withCredentials` hace que el navegador adjunte la cookie HttpOnly en cada petición. */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1',
  withCredentials: true,
})

// Estas dos rutas responden 401 cuando simplemente no hay sesión: no son una sesión vencida.
const RUTAS_DE_SESION = ['/auth/token', '/auth/me']
const CUENTA_DESACTIVADA = 'Cuenta de usuario desactivada'

let interceptorId: number | null = null

/**
 * Interceptor de respuesta: ante un 401 fuera del login, o ante un 400 «Cuenta de usuario desactivada»,
 * avisa que la sesión ya no sirve. Se instala desde main.tsx para que este archivo no dependa del authStore.
 * La vuelta a /login la hace ProtectedRoute cuando el usuario queda en null.
 */
export function instalarInterceptor(alSesionInvalida: () => void): void {
  if (interceptorId !== null) api.interceptors.response.eject(interceptorId)
  interceptorId = api.interceptors.response.use(
    (respuesta) => respuesta,
    (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const url = error.config?.url ?? ''
        const { status, data } = error.response
        const detail = (data as { detail?: unknown } | undefined)?.detail
        const esRutaDeSesion = RUTAS_DE_SESION.some((ruta) => url.includes(ruta))
        if ((status === 401 && !esRutaDeSesion) || (status === 400 && detail === CUENTA_DESACTIVADA)) {
          alSesionInvalida()
        }
      }
      return Promise.reject(error)
    },
  )
}
