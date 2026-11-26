import type { Usuario } from '@/features/usuarios/types/usuario'

/** Lo único del usuario que se guarda en el navegador (nunca el token). */
export type UsuarioSesion = Pick<Usuario, 'id' | 'username' | 'full_name' | 'email' | 'role'>

export interface RegistroData {
  username: string
  full_name: string
  email: string
  password: string
}
