import { api } from '@/shared/api/axiosInstance'
import type { Usuario } from '@/features/usuarios/types/usuario'
import type { RegistroData } from '../types/auth'

export const authApi = {
  /** Login OAuth2 (formulario). La respuesta no trae el token: viaja en la cookie HttpOnly. */
  async login(username: string, password: string): Promise<void> {
    await api.post('/auth/token', new URLSearchParams({ username, password }))
  },
  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },
  async me(): Promise<Usuario> {
    const { data } = await api.get<Usuario>('/auth/me')
    return data
  },
  async registrar(datos: RegistroData): Promise<Usuario> {
    const { data } = await api.post<Usuario>('/auth/register', datos)
    return data
  },
}
