import { useState } from 'react'
import { useCategorias } from '@/features/categorias'
import { handleApiError } from '@/shared/api/handleApiError'
import EstadoError from '@/shared/components/EstadoError'
import EstadoVacio from '@/shared/components/EstadoVacio'
import Paginacion from '@/shared/components/Paginacion'
import { useDebounce } from '@/shared/hooks/useDebounce'
import Button from '@/shared/ui/Button'
import ProductoCard from '../components/ProductoCard'
import ProductoCardSkeleton from '../components/ProductoCardSkeleton'
import { useProductos } from '../hooks/useProductos'

const POR_PAGINA = 8

export default function CatalogoPage() {
  const [pagina, setPagina] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined)
  const search = useDebounce(busqueda.trim(), 400)

  const { data: categorias = [] } = useCategorias()
  // Paginado en el servidor: skip = página × limit
  const { data, isLoading, isError, error, refetch } = useProductos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
    search: search || undefined,
    categoria_id: categoriaId,
  })

  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0
  const hayFiltros = busqueda !== '' || categoriaId !== undefined

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Catálogo</h1>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          aria-label="Buscar productos"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value)
            setPagina(0)
          }}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none sm:max-w-xs"
        />
        <select
          aria-label="Filtrar por categoría"
          value={categoriaId ?? ''}
          onChange={(e) => {
            setCategoriaId(e.target.value === '' ? undefined : Number(e.target.value))
            setPagina(0)
          }}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        {hayFiltros && (
          <Button
            variante="fantasma"
            onClick={() => {
              setBusqueda('')
              setCategoriaId(undefined)
              setPagina(0)
            }}
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {isError ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: POR_PAGINA }, (_, i) => (
            <ProductoCardSkeleton key={i} />
          ))}
        </div>
      ) : data && data.items.length === 0 ? (
        <EstadoVacio
          mensaje="No encontramos productos"
          detalle={hayFiltros ? 'Probá con otra búsqueda o categoría.' : 'Todavía no hay productos cargados.'}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data?.items.map((p) => <ProductoCard key={p.id} producto={p} />)}
          </div>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
        </>
      )}
    </section>
  )
}
