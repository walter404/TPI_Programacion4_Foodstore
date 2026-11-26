import { useQuery } from '@tanstack/react-query'
import { pedidosApi } from '../api/pedidos'

export function useResumenPedidos() {
  return useQuery({ queryKey: ['resumen-pedidos'], queryFn: pedidosApi.resumen })
}
