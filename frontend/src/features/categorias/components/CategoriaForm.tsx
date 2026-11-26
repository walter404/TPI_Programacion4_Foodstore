import { useForm } from '@tanstack/react-form'
import Alerta from '@/shared/ui/Alerta'
import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import FieldErrors from '@/shared/components/FieldErrors'
import type { CategoriaInput } from '../types/categoria'

interface Props {
  inicial: CategoriaInput
  enviando: boolean
  error: string | null
  onGuardar: (input: CategoriaInput) => void
  onCancelar: () => void
}

/** El Modal no renderiza al cerrarse, así que este formulario nace con `inicial` cada vez que se abre. */
export default function CategoriaForm({ inicial, enviando, error, onGuardar, onCancelar }: Props) {
  const form = useForm({
    defaultValues: { nombre: inicial.nombre, descripcion: inicial.descripcion ?? '' },
    onSubmit: ({ value }) =>
      onGuardar({ nombre: value.nombre.trim(), descripcion: value.descripcion.trim() || null }),
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
        name="nombre"
        validators={{
          onChange: ({ value }) => {
            const v = value.trim()
            if (v === '') return 'El nombre es obligatorio'
            if (v.length < 2) return 'Mínimo 2 caracteres'
            if (v.length > 100) return 'Máximo 100 caracteres'
            return undefined
          },
        }}
      >
        {(field) => (
          <Input
            id="nombre"
            label="Nombre"
            value={field.state.value}
            errors={field.state.meta.errors}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field
        name="descripcion"
        validators={{ onChange: ({ value }) => (value.length > 500 ? 'Máximo 500 caracteres' : undefined) }}
      >
        {(field) => (
          <div className="mb-3">
            <label htmlFor="descripcion" className="mb-1 block text-sm font-medium text-slate-700">
              Descripción (opcional)
            </label>
            <textarea
              id="descripcion"
              rows={3}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
            />
            <FieldErrors errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      <Alerta mensaje={error} />

      <form.Subscribe selector={(s) => s.canSubmit}>
        {(canSubmit) => (
          <div className="flex justify-end gap-2">
            <Button variante="secundario" onClick={onCancelar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!canSubmit || enviando}>
              {enviando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  )
}
