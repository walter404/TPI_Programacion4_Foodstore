import Button from '@/shared/ui/Button'

interface Props {
  mensaje: string
  onReintentar?: () => void
}

export default function EstadoError({ mensaje, onReintentar }: Props) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-semibold text-red-700">No se pudieron cargar los datos</p>
      <p className="mt-1 text-sm text-red-600">{mensaje}</p>
      {onReintentar && (
        <Button className="mt-3" variante="secundario" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
