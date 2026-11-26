import type { ReactNode } from 'react'

interface Props {
  abierto: boolean
  titulo: string
  onCerrar: () => void
  children: ReactNode
  ancho?: 'md' | 'lg'
}

/** Mientras está cerrado no renderiza nada: el contenido (por ejemplo un formulario) nace de cero en cada apertura. */
export default function Modal({ abierto, titulo, onCerrar, children, ancho = 'md' }: Props) {
  if (!abierto) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white p-6 shadow-xl ${ancho === 'lg' ? 'max-w-2xl' : 'max-w-md'}`}
      >
        <h2 className="mb-4 text-xl font-bold text-slate-800">{titulo}</h2>
        {children}
      </div>
    </div>
  )
}
