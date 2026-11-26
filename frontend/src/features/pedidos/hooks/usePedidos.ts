import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { pedidosApi } from '../api/pedidos'
import type { FiltrosPedidos } from '../types/pedido'

/** El backend devuelve solo los pedidos propios al cliente y todos al admin. */
export function usePedidos(filtros: FiltrosPedidos) {
  return useQuery({
    queryKey: ['pedidos', filtros],
    queryFn: () => pedidosApi.listar(filtros),
    placeholderData: keepPreviousData,
  })
}
