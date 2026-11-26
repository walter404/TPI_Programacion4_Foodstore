import type { ButtonHTMLAttributes } from 'react'

type Variante = 'primario' | 'secundario' | 'peligro' | 'fantasma'
type Tamano = 'md' | 'sm'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  tamano?: Tamano
}

const estilos: Record<Variante, string> = {
  primario: 'bg-orange-600 text-white hover:bg-orange-700 border-transparent',
  secundario: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300',
  peligro: 'bg-red-600 text-white hover:bg-red-700 border-transparent',
  fantasma: 'bg-transparent text-slate-600 hover:bg-slate-100 border-transparent',
}

const tamanos: Record<Tamano, string> = {
  md: 'px-4 py-2 text-sm',
  sm: 'px-2.5 py-1 text-xs',
}

export default function Button({ variante = 'primario', tamano = 'md', className = '', type = 'button', ...resto }: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1 rounded-md border font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${estilos[variante]} ${tamanos[tamano]} ${className}`}
      {...resto}
    />
  )
}
