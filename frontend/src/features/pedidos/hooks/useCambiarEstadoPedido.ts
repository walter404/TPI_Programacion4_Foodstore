import { useMutation, useQueryClient } from '@tanstack/react-query'
import { pedidosApi } from '../api/pedidos'
import type { EstadoPedido } from '../types/pedido'

export function useCambiarEstadoPedido() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) => pedidosApi.cambiarEstado(id, estado),
    // Cancelar restituye stock: se refrescan pedidos, productos y resumen.
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: ['pedidos'] }),
        qc.invalidateQueries({ queryKey: ['productos'] }),
        qc.invalidateQueries({ queryKey: ['resumen-pedidos'] }),
      ]),
  })
}
