import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Button from '@/shared/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

const enlace = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${isActive ? 'bg-orange-100 text-orange-700' : 'text-slate-600 hover:bg-slate-100'}`

const SECCIONES_ADMIN = [
  { to: '/admin/resumen', texto: 'Resumen' },
  { to: '/admin/categorias', texto: 'Categorías' },
  { to: '/admin/productos', texto: 'Productos' },
  { to: '/admin/pedidos', texto: 'Pedidos' },
  { to: '/admin/usuarios', texto: 'Usuarios' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const cantidad = useCartStore((s) => s.items.reduce((suma, i) => suma + i.cantidad, 0))

  const cerrarSesion = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-1">
          <NavLink to="/" className="mr-3 text-xl font-extrabold text-orange-600">
            🍔 Food Store
          </NavLink>
          <NavLink to="/" end className={enlace}>
            Catálogo
          </NavLink>
          <NavLink to="/carrito" className={enlace}>
            Carrito{cantidad > 0 && <span className="ml-1 rounded-full bg-orange-600 px-1.5 text-xs text-white">{cantidad}</span>}
          </NavLink>
          {usuario && (
            <NavLink to="/mis-pedidos" className={enlace}>
              Mis pedidos
            </NavLink>
          )}
          {usuario?.role === 'admin' && (
            <NavLink to="/admin/resumen" className={() => enlace({ isActive: pathname.startsWith('/admin') })}>
              Panel admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {usuario ? (
            <>
              <span className="text-slate-600">
                {usuario.full_name}{' '}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{usuario.role}</span>
              </span>
              <Button variante="secundario" onClick={() => void cerrarSesion()}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={enlace}>
                Ingresar
              </NavLink>
              <NavLink to="/register" className={enlace}>
                Registrarme
              </NavLink>
            </>
          )}
        </div>
      </div>

      {usuario?.role === 'admin' && pathname.startsWith('/admin') && (
        <nav aria-label="Panel de administración" className="border-t border-slate-100 bg-slate-50">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
            {SECCIONES_ADMIN.map((s) => (
              <NavLink key={s.to} to={s.to} className={enlace}>
                {s.texto}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
