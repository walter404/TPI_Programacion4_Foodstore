import { Link, Navigate } from 'react-router-dom'
import Card from '@/shared/ui/Card'
import { useAuthStore } from '@/store/authStore'
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage() {
  const usuario = useAuthStore((s) => s.usuario)
  if (usuario) return <Navigate to="/" replace />

  return (
    <Card className="mx-auto mt-8 max-w-md p-6">
      <h1 className="mb-1 text-2xl font-bold text-slate-800">Crear cuenta</h1>
      <p className="mb-4 text-sm text-slate-500">Registrate para recorrer el catálogo y pedir.</p>
      <RegisterForm />
      <p className="mt-4 text-center text-sm text-slate-600">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="font-medium text-orange-600 hover:underline">
          Ingresá
        </Link>
      </p>
    </Card>
  )
}
