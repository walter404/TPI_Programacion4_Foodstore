import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/features/auth/api/auth'
import type { UsuarioSesion } from '@/features/auth/types/auth'
import type { Usuario } from '@/features/usuarios/types/usuario'
import { queryClient } from '@/shared/api/queryClient'

interface AuthState {
  usuario: UsuarioSesion | null
  /** true hasta que checkSession confirma (o descarta) la sesión; no se guarda en el navegador. */
  cargando: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  /** La usa el interceptor de Axios cuando el servidor dice que la sesión ya no sirve. */
  limpiarSesion: () => void
}

const aSesion = ({ id, username, full_name, email, role }: Usuario): UsuarioSesion => ({ id, username, full_name, email, role })

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      login: async (username, password) => {
        await authApi.login(username, password) // el servidor pone la cookie HttpOnly
        const usuario = await authApi.me()
        queryClient.clear() // nada de la sesión anterior queda en caché
        set({ usuario: aSesion(usuario), cargando: false })
      },

      logout: async () => {
        try {
          await authApi.logout()
        } finally {
          queryClient.clear()
          set({ usuario: null, cargando: false })
        }
      },

      checkSession: async () => {
        try {
          const usuario = await authApi.me()
          set({ usuario: aSesion(usuario), cargando: false })
        } catch {
          set({ usuario: null, cargando: false })
        }
      },

      limpiarSesion: () => {
        queryClient.clear()
        set({ usuario: null, cargando: false })
      },
    }),
    {
      name: 'auth-storage',
      // Solo se guarda el usuario (nombre, email y rol). El token vive en la cookie HttpOnly y el frontend no lo ve.
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
)
