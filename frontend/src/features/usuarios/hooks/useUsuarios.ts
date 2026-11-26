import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usuariosApi } from '../api/usuarios'

const KEY = ['usuarios'] as const

export function useUsuarios() {
  return useQuery({ queryKey: KEY, queryFn: usuariosApi.listar })
}

export function useActivarUsuario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usuariosApi.activar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDesactivarUsuario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usuariosApi.desactivar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
