interface Props {
  mensaje: string | null
  tipo?: 'error' | 'exito'
}

export default function Alerta({ mensaje, tipo = 'error' }: Props) {
  if (!mensaje) return null
  const estilo = tipo === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
  return (
    <p role={tipo === 'error' ? 'alert' : 'status'} className={`mb-3 rounded-md border p-2 text-sm ${estilo}`}>
      {mensaje}
    </p>
  )
}
