import { api } from '@/shared/api/axiosInstance'
import type { EstadoPedido, FiltrosPedidos, Pedido, PedidoInput, PedidosPaginados, ResumenPedidos } from '../types/pedido'

export const pedidosApi = {
  async crear(input: PedidoInput): Promise<Pedido> {
    const { data } = await api.post<Pedido>('/pedidos', input)
    return data
  },
  async listar(filtros: FiltrosPedidos): Promise<PedidosPaginados> {
    const { data } = await api.get<PedidosPaginados>('/pedidos', { params: filtros })
    return data
  },
  async resumen(): Promise<ResumenPedidos> {
    const { data } = await api.get<ResumenPedidos>('/pedidos/resumen')
    return data
  },
  async cambiarEstado(id: number, estado: EstadoPedido): Promise<Pedido> {
    const { data } = await api.patch<Pedido>(`/pedidos/${id}/estado`, { estado })
    return data
  },
  async cancelar(id: number): Promise<Pedido> {
    const { data } = await api.patch<Pedido>(`/pedidos/${id}/cancelar`)
    return data
  },
}
