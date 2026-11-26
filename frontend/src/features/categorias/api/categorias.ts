import { api } from '@/shared/api/axiosInstance'
import type { Categoria, CategoriaInput } from '../types/categoria'

export const categoriasApi = {
  async listar(): Promise<Categoria[]> {
    const { data } = await api.get<Categoria[]>('/categorias')
    return data
  },
  async crear(input: CategoriaInput): Promise<Categoria> {
    const { data } = await api.post<Categoria>('/categorias', input)
    return data
  },
  async actualizar(id: number, input: CategoriaInput): Promise<Categoria> {
    const { data } = await api.put<Categoria>(`/categorias/${id}`, input)
    return data
  },
  async eliminar(id: number): Promise<void> {
    await api.delete(`/categorias/${id}`)
  },
}
