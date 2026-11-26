import Button from '@/shared/ui/Button'

interface Props {
  pagina: number // base 0
  totalPaginas: number
  onCambiar: (pagina: number) => void
}

export default function Paginacion({ pagina, totalPaginas, onCambiar }: Props) {
  if (totalPaginas <= 1) return null
  return (
    <nav aria-label="Paginación" className="mt-6 flex items-center justify-center gap-3 text-sm text-slate-600">
      <Button variante="secundario" onClick={() => onCambiar(pagina - 1)} disabled={pagina === 0}>
        Anterior
      </Button>
      <span>
        Página {pagina + 1} de {totalPaginas}
      </span>
      <Button variante="secundario" onClick={() => onCambiar(pagina + 1)} disabled={pagina >= totalPaginas - 1}>
        Siguiente
      </Button>
    </nav>
  )
}
