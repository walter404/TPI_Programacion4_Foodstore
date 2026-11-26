import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useUsuarios } from '@/features/usuarios'
import { handleApiError } from '@/shared/api/handleApiError'
import Cargando from '@/shared/components/Cargando'
import DataTable from '@/shared/components/DataTable'
import EstadoError from '@/shared/components/EstadoError'
import Alerta from '@/shared/ui/Alerta'
import BadgeEstado from '@/shared/ui/BadgeEstado'
import Button from '@/shared/ui/Button'
import ConfirmDialog from '@/shared/ui/ConfirmDialog'
import Modal from '@/shared/ui/Modal'
import { formatearFecha, formatearPrecio } from '@/shared/utils/formato'
import PedidoDetalle from '../components/PedidoDetalle'
import { useCambiarEstadoPedido } from '../hooks/useCambiarEstadoPedido'
import { usePedidos } from '../hooks/usePedidos'
import { TRANSICIONES, type EstadoPedido, type Pedido } from '../types/pedido'

/** Fila de la tabla: el pedido más el nombre del cliente (el backend solo trae usuario_id). */
interface FilaPedido extends Pedido {
  cliente: string
}

const columnHelper = createColumnHelper<FilaPedido>()

const ESTADOS: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}
const ETIQUETA_AVANCE: Partial<Record<EstadoPedido, string>> = {
  EN_PREPARACION: 'Pasar a preparación',
  ENTREGADO: 'Marcar entregado',
}

export default function AdminPedidosPage() {
  const [estado, setEstado] = useState<EstadoPedido | ''>('')
  // Filtro por estado en el servidor; tabla de hasta 100 pedidos paginada en el cliente.
  const { data, isLoading, isError, error, refetch } = usePedidos({ skip: 0, limit: 100, estado: estado || undefined })
  const { data: usuarios } = useUsuarios()
  const cambiarEstado = useCambiarEstadoPedido()

  const [detalle, setDetalle] = useState<Pedido | null>(null)
  const [aCancelar, setACancelar] = useState<Pedido | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }])

  // Los datos se rearman cuando llegan los usuarios: TanStack Table cachea los valores por fila,
  // así que cambiar solo la columna no alcanzaría para que aparezcan los nombres.
  const filas = useMemo<FilaPedido[]>(() => {
    const nombres = new Map((usuarios ?? []).map((u) => [u.id, u.username]))
    return (data?.items ?? []).map((p) => ({ ...p, cliente: nombres.get(p.usuario_id) ?? `Usuario ${p.usuario_id}` }))
  }, [data, usuarios])

  const mover = (pedido: Pedido, nuevo: EstadoPedido) => {
    setErrorAccion(null)
    cambiarEstado.mutate(
      { id: pedido.id, estado: nuevo },
      {
        onSuccess: () => setACancelar(null),
        onError: (e) => {
          setACancelar(null)
          setErrorAccion(handleApiError(e))
        },
      },
    )
  }

  const columnas = useMemo(
    () => [
      columnHelper.accessor('id', { header: '#', cell: (i) => `#${i.getValue()}` }),
      columnHelper.accessor('cliente', { header: 'Cliente' }),
      columnHelper.accessor('created_at', { header: 'Fecha', cell: (i) => formatearFecha(i.getValue()) }),
      columnHelper.accessor('forma_pago', { header: 'Pago' }),
      columnHelper.accessor('total', { header: 'Total', cell: (i) => formatearPrecio(i.getValue()) }),
      columnHelper.accessor('estado', { header: 'Estado', cell: (i) => <BadgeEstado estado={i.getValue()} /> }),
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => {
          const p = row.original
          const siguientes = TRANSICIONES[p.estado]
          const avance = siguientes.find((s) => s !== 'CANCELADO')
          return (
            <div className="flex flex-wrap gap-2">
              <Button variante="secundario" tamano="sm" onClick={() => setDetalle(p)}>
                Detalle
              </Button>
              {avance && (
                <Button tamano="sm" disabled={cambiarEstado.isPending} onClick={() => mover(p, avance)}>
                  {ETIQUETA_AVANCE[avance] ?? avance}
                </Button>
              )}
              {siguientes.includes('CANCELADO') && (
                <Button variante="peligro" tamano="sm" onClick={() => setACancelar(p)}>
                  Cancelar
                </Button>
              )}
            </div>
          )
        },
      }),
    ],
    [cambiarEstado.isPending],
  )

  const table = useReactTable({
    data: filas,
    columns: columnas,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Pedidos</h1>
        <select
          aria-label="Filtrar por estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value as EstadoPedido | '')}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
        >
          <option value="">Todos los estados</option>
          {(Object.keys(ESTADOS) as EstadoPedido[]).map((e) => (
            <option key={e} value={e}>
              {ESTADOS[e]}
            </option>
          ))}
        </select>
      </div>

      <Alerta mensaje={errorAccion} />
      {isLoading && <Cargando />}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />}
      {data && <DataTable table={table} mensajeVacio="No hay pedidos con ese filtro." sinBusqueda />}

      <Modal abierto={detalle !== null} titulo={`Pedido #${detalle?.id ?? ''}`} onCerrar={() => setDetalle(null)} ancho="lg">
        {detalle && <PedidoDetalle pedido={detalle} />}
        <div className="mt-4 flex justify-end">
          <Button variante="secundario" onClick={() => setDetalle(null)}>
            Cerrar
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        abierto={aCancelar !== null}
        titulo="Cancelar pedido"
        mensaje={`¿Cancelar el pedido #${aCancelar?.id ?? ''}? El stock de sus productos se restituye y el estado no se puede revertir.`}
        textoConfirmar="Sí, cancelar"
        procesando={cambiarEstado.isPending}
        onConfirmar={() => aCancelar && mover(aCancelar, 'CANCELADO')}
        onCancelar={() => setACancelar(null)}
      />
    </section>
  )
}
