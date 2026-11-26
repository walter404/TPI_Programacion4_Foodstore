import { useEffect } from 'react'
import AppRouter from '@/routes/AppRouter'
import { useAuthStore } from '@/store/authStore'

export default function App() {
  const checkSession = useAuthStore((s) => s.checkSession)

  // Única llamada al servidor dentro de un useEffect: confirma si la cookie sigue valiendo.
  useEffect(() => {
    void checkSession()
  }, [checkSession])

  return <AppRouter />
}
