import { api } from '@/shared/api/axiosInstance'
import type { Usuario } from '../types/usuario'

export const usuariosApi = {
  async listar(): Promise<Usuario[]> {
    const { data } = await api.get<Usuario[]>('/admin/usuarios')
    return data
  },
  async activar(id: number): Promise<Usuario> {
    const { data } = await api.post<Usuario>(`/admin/usuarios/${id}/activar`)
    return data
  },
  async desactivar(id: number): Promise<Usuario> {
    const { data } = await api.post<Usuario>(`/admin/usuarios/${id}/desactivar`)
    return data
  },
}
