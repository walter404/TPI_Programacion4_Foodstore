import { api } from '@/shared/api/axiosInstance'
import type { FiltrosProductos, Producto, ProductoInput, ProductosPaginados, StockInput } from '../types/producto'

export const productosApi = {
  async listar(filtros: FiltrosProductos): Promise<ProductosPaginados> {
    const { data } = await api.get<ProductosPaginados>('/productos', { params: filtros })
    return data
  },
  async crear(input: ProductoInput): Promise<Producto> {
    const { data } = await api.post<Producto>('/productos', input)
    return data
  },
  async actualizar(id: number, input: ProductoInput): Promise<Producto> {
    const { data } = await api.put<Producto>(`/productos/${id}`, input)
    return data
  },
  async actualizarStock(id: number, input: StockInput): Promise<Producto> {
    const { data } = await api.patch<Producto>(`/productos/${id}/stock`, input)
    return data
  },
  async eliminar(id: number): Promise<void> {
    await api.delete(`/productos/${id}`)
  },
}
