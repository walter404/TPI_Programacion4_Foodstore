import { useState } from 'react'
import { formatearPrecio } from '@/shared/utils/formato'
import Button from '@/shared/ui/Button'
import Card from '@/shared/ui/Card'
import { useCartStore } from '@/store/cartStore'
import type { Producto } from '../types/producto'

export default function ProductoCard({ producto }: { producto: Producto }) {
  const agregar = useCartStore((s) => s.agregar)
  const enCarrito = useCartStore((s) => s.items.find((i) => i.producto_id === producto.id)?.cantidad ?? 0)
  const [imagenRota, setImagenRota] = useState(false)

  const sinStock = !producto.disponible || producto.stock <= 0
  // No se puede pedir más de lo que hay: el backend igual lo valida, pero así se evita el error.
  const alMaximo = enCarrito >= producto.stock

  return (
    <Card className="flex flex-col overflow-hidden" data-testid="producto-card">
      {producto.imagen_url && !imagenRota ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          onError={() => setImagenRota(true)}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-orange-50 text-5xl" aria-hidden="true">
          🍔
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-orange-600">{producto.categoria.nombre}</span>
        <h3 className="mt-1 text-lg font-semibold text-slate-800">{producto.nombre}</h3>
        <p className="mt-1 flex-1 text-sm text-slate-500">{producto.descripcion ?? 'Sin descripción'}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-800">{formatearPrecio(producto.precio_base)}</span>
          {sinStock ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">Sin stock</span>
          ) : (
            <span className="text-xs text-slate-500">Quedan {producto.stock}</span>
          )}
        </div>
        <Button
          className="mt-3 w-full"
          disabled={sinStock || alMaximo}
          onClick={() => agregar({ producto_id: producto.id, nombre: producto.nombre, precio_unitario: producto.precio_base })}
        >
          {sinStock ? 'No disponible' : alMaximo ? 'Máximo en el carrito' : 'Agregar al carrito'}
        </Button>
      </div>
    </Card>
  )
}
