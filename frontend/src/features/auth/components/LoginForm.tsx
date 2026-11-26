import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleApiError } from '@/shared/api/handleApiError'
import Alerta from '@/shared/ui/Alerta'
import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import { useAuthStore } from '@/store/authStore'

interface Props {
  /** Ruta a la que volver después de ingresar (la que quiso abrir antes de ser mandado al login). */
  destino?: string
}

const obligatorio = (mensaje: string) => ({ value }: { value: string }) => (value.trim() === '' ? mensaje : undefined)

export default function LoginForm({ destino }: Props) {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { username: '', password: '' },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        await login(value.username.trim(), value.password)
        const usuario = useAuthStore.getState().usuario
        navigate(destino ?? (usuario?.role === 'admin' ? '/admin/resumen' : '/'), { replace: true })
      } catch (e) {
        setError(handleApiError(e))
      }
    },
  })

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <form.Field name="username" validators={{ onChange: obligatorio('Ingresá tu usuario') }}>
        {(field) => (
          <Input
            id="username"
            label="Usuario"
            autoComplete="username"
            value={field.state.value}
            errors={field.state.meta.errors}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field name="password" validators={{ onChange: obligatorio('Ingresá tu contraseña') }}>
        {(field) => (
          <Input
            id="password"
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            value={field.state.value}
            errors={field.state.meta.errors}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <Alerta mensaje={error} />

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
