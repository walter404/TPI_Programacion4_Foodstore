import { formatearFecha, formatearPrecio } from '@/shared/utils/formato'
import BadgeEstado from '@/shared/ui/BadgeEstado'
import type { Pedido } from '../types/pedido'

const PAGO: Record<Pedido['forma_pago'], string> = { EFECTIVO: 'Efectivo', TRANSFERENCIA: 'Transferencia' }

export default function PedidoDetalle({ pedido }: { pedido: Pedido }) {
  return (
    <div className="text-sm text-slate-700">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <BadgeEstado estado={pedido.estado} />
        <span>Creado: {formatearFecha(pedido.created_at)}</span>
        <span>Actualizado: {formatearFecha(pedido.updated_at)}</span>
      </div>
      <p>
        <strong>Entrega en:</strong> {pedido.direccion_entrega}
      </p>
      <p>
        <strong>Forma de pago:</strong> {PAGO[pedido.forma_pago]}
      </p>
      {pedido.notas && (
        <p>
          <strong>Notas:</strong> {pedido.notas}
        </p>
      )}

      <table className="mt-3 w-full text-left">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
            <th className="py-1">Producto</th>
            <th className="py-1 text-right">Cant.</th>
            <th className="py-1 text-right">Precio</th>
            <th className="py-1 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedido.items.map((item) => (
            <tr key={item.producto_id} className="border-b border-slate-100">
              <td className="py-1.5">{item.nombre_producto}</td>
              <td className="py-1.5 text-right">{item.cantidad}</td>
              <td className="py-1.5 text-right">{formatearPrecio(item.precio_unitario)}</td>
              <td className="py-1.5 text-right">{formatearPrecio(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="pt-2 text-right font-semibold">
              Total
            </td>
            <td className="pt-2 text-right text-base font-bold">{formatearPrecio(pedido.total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
