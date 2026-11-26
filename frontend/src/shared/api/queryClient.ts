import { QueryClient } from '@tanstack/react-query'

/** Instancia única de TanStack Query. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
})
