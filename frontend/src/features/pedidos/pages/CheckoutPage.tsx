import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import Card from '@/shared/ui/Card'
import { formatearPrecio } from '@/shared/utils/formato'
import { useCartStore } from '@/store/cartStore'
import CheckoutForm from '../components/CheckoutForm'

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())
  // Si se entra con el carrito vacío no hay nada que confirmar. Se mira solo al montar: cuando el pedido se
  // confirma el carrito se vacía y el formulario navega a «Mis pedidos» por su cuenta.
  const [entroVacio] = useState(items.length === 0)
  if (entroVacio) return <Navigate to="/carrito" replace />

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Confirmar pedido</h1>
      <div className="grid gap-6 md:grid-cols-5">
        <Card className="p-5 md:col-span-3">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Datos de entrega</h2>
          <CheckoutForm />
        </Card>
        <Card className="h-fit p-5 md:col-span-2">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Tu pedido</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {items.map((i) => (
              <li key={i.producto_id} className="flex justify-between gap-2">
                <span>
                  {i.cantidad} × {i.nombre}
                </span>
                <span>{formatearPrecio(i.precio_unitario * i.cantidad)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-800">
            <span>Total</span>
            <span>{formatearPrecio(total)}</span>
          </p>
        </Card>
      </div>
    </section>
  )
}
