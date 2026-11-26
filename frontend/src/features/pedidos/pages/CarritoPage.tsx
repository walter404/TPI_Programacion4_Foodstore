import { Link, useNavigate } from 'react-router-dom'
import EstadoVacio from '@/shared/components/EstadoVacio'
import Button from '@/shared/ui/Button'
import Card from '@/shared/ui/Card'
import { formatearPrecio } from '@/shared/utils/formato'
import { useCartStore } from '@/store/cartStore'

export default function CarritoPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())
  const { quitar, cambiarCantidad, vaciar } = useCartStore.getState()

  if (items.length === 0) {
    return (
      <section>
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Carrito</h1>
        <EstadoVacio mensaje="Tu carrito está vacío" detalle="Sumá productos desde el catálogo.">
          <Link to="/" className="font-medium text-orange-600 hover:underline">
            Ir al catálogo
          </Link>
        </EstadoVacio>
      </section>
    )
  }

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Carrito</h1>
      <Card className="divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.producto_id} className="flex flex-wrap items-center gap-4 p-4" data-testid="item-carrito">
            <div className="min-w-40 flex-1">
              <p className="font-semibold text-slate-800">{item.nombre}</p>
              <p className="text-sm text-slate-500">{formatearPrecio(item.precio_unitario)} c/u</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variante="secundario"
                tamano="sm"
                aria-label={`Quitar una unidad de ${item.nombre}`}
                disabled={item.cantidad <= 1}
                onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
              >
                −
              </Button>
              <span className="w-8 text-center font-medium" aria-label={`Cantidad de ${item.nombre}`}>
                {item.cantidad}
              </span>
              <Button
                variante="secundario"
                tamano="sm"
                aria-label={`Agregar una unidad de ${item.nombre}`}
                onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
              >
                +
              </Button>
            </div>
            <p className="w-28 text-right font-semibold text-slate-800">{formatearPrecio(item.precio_unitario * item.cantidad)}</p>
            <Button variante="fantasma" tamano="sm" onClick={() => quitar(item.producto_id)}>
              Quitar
            </Button>
          </div>
        ))}
      </Card>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Button variante="secundario" onClick={vaciar}>
          Vaciar carrito
        </Button>
        <div className="flex items-center gap-4">
          <p className="text-xl font-bold text-slate-800">Total: {formatearPrecio(total)}</p>
          <Button onClick={() => navigate('/checkout')}>Continuar con el pedido</Button>
        </div>
      </div>
    </section>
  )
}
