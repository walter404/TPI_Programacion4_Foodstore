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
import { useAuthStore } from '@/store/authStore'
import AccionesUsuario from '../components/AccionesUsuario'
import { useUsuarios } from '../hooks/useUsuarios'
import type { Usuario } from '../types/usuario'

const columnHelper = createColumnHelper<Usuario>()

export default function AdminUsuariosPage() {
  const miId = useAuthStore((s) => s.usuario?.id)
  const { data, isLoading, isError, error, refetch } = useUsuarios()

  const [errorAccion, setErrorAccion] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filtro, setFiltro] = useState('')

  const columnas = useMemo(() => {
    return [
      columnHelper.accessor('username', { header: 'Usuario' }),
      columnHelper.accessor('full_name', { header: 'Nombre' }),
      columnHelper.accessor('email', { header: 'Email' }),
      columnHelper.accessor('role', {
        header: 'Rol',
        cell: (i) => (
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${i.getValue() === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'}`}>
            {i.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('disabled', {
        header: 'Estado',
        cell: (i) =>
          i.getValue() ? (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">Desactivado</span>
          ) : (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">Activo</span>
          ),
      }),
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => <AccionesUsuario usuario={row.original} miId={miId} onError={setErrorAccion} />,
      }),
    ]
  }, [miId])

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
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Usuarios</h1>
      <Alerta mensaje={errorAccion} />
      {isLoading && <Cargando />}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />}
      {data && <DataTable table={table} placeholderBusqueda="Buscar usuario..." mensajeVacio="No hay usuarios." />}
    </section>
  )
}
