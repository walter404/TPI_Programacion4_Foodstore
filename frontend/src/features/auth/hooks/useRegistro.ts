import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth'
import type { RegistroData } from '../types/auth'

export function useRegistro() {
  return useMutation({ mutationFn: (datos: RegistroData) => authApi.registrar(datos) })
}
