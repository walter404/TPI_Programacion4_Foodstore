import type { ReactNode } from 'react'

interface Props {
  mensaje: string
  detalle?: string
  children?: ReactNode
}

export default function EstadoVacio({ mensaje, detalle, children }: Props) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="text-3xl">🍽️</p>
      <p className="mt-2 font-semibold text-slate-700">{mensaje}</p>
      {detalle && <p className="mt-1 text-sm text-slate-500">{detalle}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
