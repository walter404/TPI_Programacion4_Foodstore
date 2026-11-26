import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { instalarInterceptor } from '@/shared/api/axiosInstance'
import { queryClient } from '@/shared/api/queryClient'
import { useAuthStore } from '@/store/authStore'

// 401 fuera del login o cuenta desactivada → se limpia la sesión; ProtectedRoute manda a /login.
instalarInterceptor(() => useAuthStore.getState().limpiarSesion())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
