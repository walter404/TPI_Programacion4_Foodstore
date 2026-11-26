import { Link, Navigate, useLocation } from 'react-router-dom'
import Alerta from '@/shared/ui/Alerta'
import Card from '@/shared/ui/Card'
import { useAuthStore } from '@/store/authStore'
import LoginForm from '../components/LoginForm'

interface EstadoLogin {
  registrado?: boolean
  from?: { pathname: string }
}

export default function LoginPage() {
  const usuario = useAuthStore((s) => s.usuario)
  const state = useLocation().state as EstadoLogin | null

  // Si venía de una ruta protegida vuelve a ella; si no, el admin va al panel y el cliente al catálogo.
  const origen = state?.from?.pathname
  if (usuario) return <Navigate to={origen ?? (usuario.role === 'admin' ? '/admin/resumen' : '/')} replace />

  return (
    <Card className="mx-auto mt-8 max-w-md p-6">
      <h1 className="mb-1 text-2xl font-bold text-slate-800">Ingresar</h1>
      <p className="mb-4 text-sm text-slate-500">Entrá con tu usuario para hacer pedidos.</p>
      <Alerta tipo="exito" mensaje={state?.registrado ? 'Cuenta creada. Ya podés ingresar.' : null} />
      <LoginForm destino={origen} />
      <p className="mt-4 text-center text-sm text-slate-600">
        ¿No tenés cuenta?{' '}
        <Link to="/register" className="font-medium text-orange-600 hover:underline">
          Registrate
        </Link>
      </p>
    </Card>
  )
}
