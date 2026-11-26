import { Link } from 'react-router-dom'
import Card from '@/shared/ui/Card'

export default function UnauthorizedPage() {
  return (
    <Card className="mx-auto mt-8 max-w-md p-8 text-center">
      <p className="text-4xl">🔒</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-800">Sin permiso</h1>
      <p className="mt-2 text-slate-600">Tu cuenta no tiene acceso a esta pantalla.</p>
      <Link to="/" className="mt-4 inline-block font-medium text-orange-600 hover:underline">
        Volver al inicio
      </Link>
    </Card>
  )
}
