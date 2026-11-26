import { useState } from 'react'
import { Link } from 'react-router-dom'
import { handleApiError } from '@/shared/api/handleApiError'
import EstadoError from '@/shared/components/EstadoError'
import EstadoVacio from '@/shared/components/EstadoVacio'
import Paginacion from '@/shared/components/Paginacion'
import Skeleton from '@/shared/components/Skeleton'
import Alerta from '@/shared/ui/Alerta'
import ConfirmDialog from '@/shared/ui/ConfirmDialog'
import PedidoCard from '../components/PedidoCard'
import { useCancelarPedido } from '../hooks/useCancelarPedido'
import { usePedidos } from '../hooks/usePedidos'
import type { Pedido } from '../types/pedido'

const POR_PAGINA = 5

export default function MisPedidosPage() {
  const [pagina, setPagina] = useState(0)
  const { data, isLoading, isError, error, refetch } = usePedidos({ skip: pagina * POR_PAGINA, limit: POR_PAGINA })
  const cancelar = useCancelarPedido()
  const [aCancelar, setACancelar] = useState<Pedido | null>(null)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)

  const confirmarCancelacion = () => {
    if (!aCancelar) return
    setErrorAccion(null)
    cancelar.mutate(aCancelar.id, {
      onSuccess: () => setACancelar(null),
      onError: (e) => {
        setACancelar(null)
        setErrorAccion(handleApiError(e))
      },
    })
  }

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Mis pedidos</h1>
      <Alerta mensaje={errorAccion} />

      {isError ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : data && data.items.length === 0 ? (
        <EstadoVacio mensaje="Todavía no hiciste ningún pedido" detalle="Cuando confirmes uno, lo vas a ver acá.">
          <Link to="/" className="font-medium text-orange-600 hover:underline">
            Ir al catálogo
          </Link>
        </EstadoVacio>
      ) : (
        <>
          <div className="space-y-3">
            {data?.items.map((p) => <PedidoCard key={p.id} pedido={p} onCancelar={setACancelar} />)}
          </div>
          <Paginacion pagina={pagina} totalPaginas={data ? Math.ceil(data.total / POR_PAGINA) : 0} onCambiar={setPagina} />
        </>
      )}

      <ConfirmDialog
        abierto={aCancelar !== null}
        titulo="Cancelar pedido"
        mensaje={`¿Cancelar el pedido #${aCancelar?.id ?? ''}? El stock de los productos se restituye y no se puede deshacer.`}
        textoConfirmar="Sí, cancelar"
        procesando={cancelar.isPending}
        onConfirmar={confirmarCancelacion}
        onCancelar={() => setACancelar(null)}
      />
    </section>
  )
}
