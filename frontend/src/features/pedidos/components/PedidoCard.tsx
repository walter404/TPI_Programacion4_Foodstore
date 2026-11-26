import { useState } from 'react'
import BadgeEstado from '@/shared/ui/BadgeEstado'
import Button from '@/shared/ui/Button'
import Card from '@/shared/ui/Card'
import { formatearFecha, formatearPrecio } from '@/shared/utils/formato'
import type { Pedido } from '../types/pedido'
import PedidoDetalle from './PedidoDetalle'

interface Props {
  pedido: Pedido
  onCancelar: (pedido: Pedido) => void
}

/** Un pedido del cliente: resumen, detalle desplegable y cancelación solo en PENDIENTE. */
export default function PedidoCard({ pedido, onCancelar }: Props) {
  const [abierto, setAbierto] = useState(false)

  return (
    <Card className="p-4" data-testid="pedido-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-800">Pedido #{pedido.id}</p>
          <p className="text-xs text-slate-500">{formatearFecha(pedido.created_at)}</p>
        </div>
        <BadgeEstado estado={pedido.estado} />
        <p className="text-lg font-bold text-slate-800">{formatearPrecio(pedido.total)}</p>
        <div className="flex gap-2">
          <Button variante="secundario" tamano="sm" onClick={() => setAbierto((v) => !v)}>
            {abierto ? 'Ocultar detalle' : 'Ver detalle'}
          </Button>
          {pedido.estado === 'PENDIENTE' && (
            <Button variante="peligro" tamano="sm" onClick={() => onCancelar(pedido)}>
              Cancelar pedido
            </Button>
          )}
        </div>
      </div>
      {abierto && (
        <div className="mt-4 border-t border-slate-200 pt-4">
          <PedidoDetalle pedido={pedido} />
        </div>
      )}
    </Card>
  )
}
