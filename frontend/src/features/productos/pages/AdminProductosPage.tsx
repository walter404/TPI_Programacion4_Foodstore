import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { handleApiError } from '@/shared/api/handleApiError'
import Cargando from '@/shared/components/Cargando'
import DataTable from '@/shared/components/DataTable'
import EstadoError from '@/shared/components/EstadoError'
import Alerta from '@/shared/ui/Alerta'
import Button from '@/shared/ui/Button'
import ConfirmDialog from '@/shared/ui/ConfirmDialog'
import Modal from '@/shared/ui/Modal'
import { formatearPrecio } from '@/shared/utils/formato'
import ProductoForm from '../components/ProductoForm'
import StockForm from '../components/StockForm'
import {
  useActualizarProducto,
  useActualizarStock,
  useCrearProducto,
  useEliminarProducto,
  useProductos,
} from '../hooks/useProductos'
import type { Producto, ProductoInput, StockInput } from '../types/producto'

const columnHelper = createColumnHelper<Producto>()

export default function AdminProductosPage() {
  // El panel pide todo de una vez (limit=100) y pagina/ordena/filtra del lado del cliente con TanStack Table.
  const { data, isLoading, isError, error, refetch } = useProductos({ skip: 0, limit: 100 })
  const crear = useCrearProducto()
  const actualizar = useActualizarProducto()
  const actualizarStock = useActualizarStock()
  const eliminar = useEliminarProducto()

  const [formAbierto, setFormAbierto] = useState(false)
  const [editando, setEditando] = useState<Producto | null>(null)
  const [stockDe, setStockDe] = useState<Producto | null>(null)
  const [aEliminar, setAEliminar] = useState<Producto | null>(null)
  const [errorForm, setErrorForm] = useState<string | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filtro, setFiltro] = useState('')

  const abrirNuevo = () => {
    setEditando(null)
    setErrorForm(null)
    setFormAbierto(true)
  }
  const abrirEdicion = (p: Producto) => {
    setEditando(p)
    setErrorForm(null)
    setFormAbierto(true)
  }
  const abrirStock = (p: Producto) => {
    setErrorForm(null)
    setStockDe(p)
  }

  const guardar = (input: ProductoInput) => {
    setErrorForm(null)
    const opciones = {
      onSuccess: () => setFormAbierto(false),
      onError: (e: unknown) => setErrorForm(handleApiError(e)),
    }
    if (editando) actualizar.mutate({ id: editando.id, input }, opciones)
    else crear.mutate(input, opciones)
  }

  const guardarStock = (input: StockInput) => {
    if (!stockDe) return
    setErrorForm(null)
    actualizarStock.mutate(
      { id: stockDe.id, input },
      { onSuccess: () => setStockDe(null), onError: (e) => setErrorForm(handleApiError(e)) },
    )
  }

  const confirmarBaja = () => {
    if (!aEliminar) return
    setErrorAccion(null)
    eliminar.mutate(aEliminar.id, {
      onSuccess: () => setAEliminar(null),
      onError: (e) => {
        setAEliminar(null)
        setErrorAccion(handleApiError(e))
      },
    })
  }

  const columnas = useMemo(
    () => [
      columnHelper.accessor('id', { header: 'ID' }),
      columnHelper.accessor('nombre', { header: 'Nombre' }),
      columnHelper.accessor((p) => p.categoria.nombre, { id: 'categoria', header: 'Categoría' }),
      columnHelper.accessor('precio_base', { header: 'Precio', cell: (i) => formatearPrecio(i.getValue()) }),
      columnHelper.accessor('stock', {
        header: 'Stock',
        cell: (i) => <span className={i.getValue() === 0 ? 'font-semibold text-red-600' : ''}>{i.getValue()}</span>,
      }),
      columnHelper.accessor('disponible', {
        header: 'Disponible',
        cell: (i) =>
          i.getValue() ? (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">Sí</span>
          ) : (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">No</span>
          ),
      }),
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <Button variante="secundario" tamano="sm" onClick={() => abrirEdicion(row.original)}>
              Editar
            </Button>
            <Button variante="secundario" tamano="sm" onClick={() => abrirStock(row.original)}>
              Stock
            </Button>
            <Button variante="peligro" tamano="sm" onClick={() => setAEliminar(row.original)}>
              Eliminar
            </Button>
          </div>
        ),
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: data?.items ?? [],
    columns: columnas,
    state: { sorting, globalFilter: filtro },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltro,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  })

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Productos</h1>
        <Button onClick={abrirNuevo}>Nuevo producto</Button>
      </div>

      <Alerta mensaje={errorAccion} />

      {isLoading && <Cargando />}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />}
      {data && <DataTable table={table} placeholderBusqueda="Buscar producto..." mensajeVacio="No hay productos." />}

      <Modal abierto={formAbierto} titulo={editando ? 'Editar producto' : 'Nuevo producto'} onCerrar={() => setFormAbierto(false)} ancho="lg">
        <ProductoForm
          producto={editando}
          enviando={crear.isPending || actualizar.isPending}
          error={errorForm}
          onGuardar={guardar}
          onCancelar={() => setFormAbierto(false)}
        />
      </Modal>

      <Modal abierto={stockDe !== null} titulo="Stock y disponibilidad" onCerrar={() => setStockDe(null)}>
        {stockDe && (
          <StockForm
            producto={stockDe}
            enviando={actualizarStock.isPending}
            error={errorForm}
            onGuardar={guardarStock}
            onCancelar={() => setStockDe(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        abierto={aEliminar !== null}
        titulo="Eliminar producto"
        mensaje={`¿Dar de baja «${aEliminar?.nombre ?? ''}»? Deja de aparecer en el catálogo; los pedidos ya hechos no cambian.`}
        textoConfirmar="Eliminar"
        procesando={eliminar.isPending}
        onConfirmar={confirmarBaja}
        onCancelar={() => setAEliminar(null)}
      />
    </section>
  )
}
