import { useMutation, useQueryClient } from '@tanstack/react-query'
import { pedidosApi } from '../api/pedidos'
import type { PedidoInput } from '../types/pedido'

export function useCrearPedido() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: PedidoInput) => pedidosApi.crear(input),
    // Crear un pedido descuenta stock: también se refresca el catálogo.
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: ['pedidos'] }),
        qc.invalidateQueries({ queryKey: ['productos'] }),
        qc.invalidateQueries({ queryKey: ['resumen-pedidos'] }),
      ]),
  })
}
