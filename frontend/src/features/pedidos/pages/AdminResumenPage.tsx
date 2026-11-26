import { handleApiError } from '@/shared/api/handleApiError'
import Cargando from '@/shared/components/Cargando'
import EstadoError from '@/shared/components/EstadoError'
import { formatearPrecio } from '@/shared/utils/formato'
import ResumenCard from '../components/ResumenCard'
import { useResumenPedidos } from '../hooks/useResumenPedidos'

export default function AdminResumenPage() {
  const { data, isLoading, isError, error, refetch } = useResumenPedidos()

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Resumen del negocio</h1>
      {isLoading && <Cargando />}
      {isError && <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />}
      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ResumenCard titulo="Pedidos pendientes" valor={data.pendientes} acento="text-amber-600" />
          <ResumenCard titulo="En preparación" valor={data.en_preparacion} acento="text-blue-600" />
          <ResumenCard titulo="Entregados" valor={data.entregados} acento="text-green-600" />
          <ResumenCard titulo="Cancelados" valor={data.cancelados} acento="text-red-600" />
          <ResumenCard titulo="Pedidos de hoy" valor={data.pedidos_hoy} />
          <ResumenCard titulo="Ingresos (entregados)" valor={formatearPrecio(data.ingresos_entregados)} acento="text-orange-600" />
        </div>
      )}
    </section>
  )
}
