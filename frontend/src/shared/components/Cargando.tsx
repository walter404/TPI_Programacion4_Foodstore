export default function Cargando({ mensaje = 'Cargando...' }: { mensaje?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-20 text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-orange-600" />
      {mensaje}
    </div>
  )
}
