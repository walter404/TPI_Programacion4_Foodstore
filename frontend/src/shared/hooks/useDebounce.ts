import { useEffect, useState } from 'react'

/** Devuelve `valor` recién después de `demora` ms sin cambios (para no consultar en cada tecla). */
export function useDebounce<T>(valor: T, demora = 400): T {
  const [debounced, setDebounced] = useState(valor)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(valor), demora)
    return () => clearTimeout(id)
  }, [valor, demora])
  return debounced
}
