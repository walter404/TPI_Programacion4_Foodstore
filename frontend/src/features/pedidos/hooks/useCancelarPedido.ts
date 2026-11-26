import { useMutation, useQueryClient } from '@tanstack/react-query'
import { pedidosApi } from '../api/pedidos'

export function useCancelarPedido() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => pedidosApi.cancelar(id),
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: ['pedidos'] }),
        qc.invalidateQueries({ queryKey: ['productos'] }),
      ]),
  })
}
