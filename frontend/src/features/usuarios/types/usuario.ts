export type Rol = 'user' | 'admin'

/** Mismos campos que `UserPublic` del backend. */
export interface Usuario {
  id: number
  username: string
  full_name: string
  email: string
  role: Rol
  disabled: boolean
  created_at: string
}
