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
import CategoriaForm from '../components/CategoriaForm'
import {
  useActualizarCategoria,
  useCategorias,
  useCrearCategoria,
  useEliminarCategoria,
} from '../hooks/useCategorias'
import type { Categoria, CategoriaInput } from '../types/categoria'

const columnHelper = createColumnHelper<Categoria>()
const VACIA: CategoriaInput = { nombre: '', descripcion: null }

export default function AdminCategoriasPage() {
  const { data, isLoading, isError, error, refetch } = useCategorias()
  const crear = useCrearCategoria()
  const actualizar = useActualizarCategoria()
  const eliminar = useEliminarCategoria()

  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Categoria | null>(null)
  const [aEliminar, setAEliminar] = useState<Categoria | null>(null)
  const [errorForm, setErrorForm] = useState<string | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filtro, setFiltro] = useState('')

  const abrirNueva = () => {
    setEditando(null)
    setErrorForm(null)
    setModalAbierto(true)
  }
  const abrirEdicion = (c: Categoria) => {
    setEditando(c)
    setErrorForm(null)
    setModalAbierto(true)
  }

  const guardar = (input: CategoriaInput) => {
    setErrorForm(null)
    const opciones = {
      onSuccess: () => setModalAbierto(false),
      onError: (e: unknown) => setErrorForm(handleApiError(e)),
    }
    if (editando) actualizar.mutate({ id: editando.id, input }, opciones)
    else crear.mutate(input, opciones)
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
      columnHelper.accessor((c) => c.descripcion ?? '', {
        id: 'descripcion',
        header: 'Descripción',
        cell: (info) => info.getValue() || <span className="text-slate-400">—</span>,
      }),
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button variante="secundario" tamano="sm" onClick={() => abrirEdicion(row.original)}>
              Editar
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
    data: data ?? [],
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
        <h1 className="text-2xl font-bold text-slate-800">Categorías</h1>
        <Button onClick={abrirNueva}>Nueva categoría</Button>
      </div>

      <Alerta mensaje={errorAccion} />

      {isLoading && <Cargando />}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />}
      {data && <DataTable table={table} placeholderBusqueda="Buscar categoría..." mensajeVacio="No hay categorías." />}

      <Modal abierto={modalAbierto} titulo={editando ? 'Editar categoría' : 'Nueva categoría'} onCerrar={() => setModalAbierto(false)}>
        <CategoriaForm
          inicial={editando ? { nombre: editando.nombre, descripcion: editando.descripcion } : VACIA}
          enviando={crear.isPending || actualizar.isPending}
          error={errorForm}
          onGuardar={guardar}
          onCancelar={() => setModalAbierto(false)}
        />
      </Modal>

      <ConfirmDialog
        abierto={aEliminar !== null}
        titulo="Eliminar categoría"
        mensaje={`¿Dar de baja la categoría «${aEliminar?.nombre ?? ''}»? Sus productos siguen en el catálogo y el nombre no se libera.`}
        textoConfirmar="Eliminar"
        procesando={eliminar.isPending}
        onConfirmar={confirmarBaja}
        onCancelar={() => setAEliminar(null)}
      />
    </section>
  )
}
