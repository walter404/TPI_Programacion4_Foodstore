import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleApiError } from '@/shared/api/handleApiError'
import Alerta from '@/shared/ui/Alerta'
import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import { useRegistro } from '../hooks/useRegistro'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterForm() {
  const navigate = useNavigate()
  const { mutateAsync: registrar } = useRegistro()
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { username: '', full_name: '', email: '', password: '', repetir: '' },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        await registrar({
          username: value.username.trim(),
          full_name: value.full_name.trim(),
          email: value.email.trim(),
          password: value.password,
        })
        navigate('/login', { replace: true, state: { registrado: true } })
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
      <form.Field
        name="username"
        validators={{
          onChange: ({ value }) => {
            const v = value.trim()
            if (v === '') return 'El usuario es obligatorio'
            if (v.length < 3) return 'Mínimo 3 caracteres'
            if (v.length > 50) return 'Máximo 50 caracteres'
            return undefined
          },
        }}
      >
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

      <form.Field
        name="full_name"
        validators={{
          onChange: ({ value }) => {
            const v = value.trim()
            if (v === '') return 'El nombre es obligatorio'
            if (v.length < 2) return 'Mínimo 2 caracteres'
            return undefined
          },
        }}
      >
        {(field) => (
          <Input
            id="full_name"
            label="Nombre completo"
            autoComplete="name"
            value={field.state.value}
            errors={field.state.meta.errors}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            if (value.trim() === '') return 'El email es obligatorio'
            if (!EMAIL.test(value.trim())) return 'Ingresá un email válido'
            return undefined
          },
        }}
      >
        {(field) => (
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={field.state.value}
            errors={field.state.meta.errors}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => {
            if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
            if (value.length > 72) return 'Máximo 72 caracteres'
            return undefined
          },
        }}
      >
        {(field) => (
          <Input
            id="password"
            label="Contraseña"
            type="password"
            autoComplete="new-password"
            value={field.state.value}
            errors={field.state.meta.errors}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field
        name="repetir"
        validators={{
          onChangeListenTo: ['password'],
          onChange: ({ value, fieldApi }) =>
            value !== fieldApi.form.getFieldValue('password') ? 'Las contraseñas no coinciden' : undefined,
        }}
      >
        {(field) => (
          <Input
            id="repetir"
            label="Repetir contraseña"
            type="password"
            autoComplete="new-password"
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
            {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
