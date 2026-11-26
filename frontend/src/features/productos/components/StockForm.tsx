import { useForm } from '@tanstack/react-form'
import Alerta from '@/shared/ui/Alerta'
import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import type { Producto, StockInput } from '../types/producto'

interface Props {
  producto: Producto
  enviando: boolean
  error: string | null
  onGuardar: (input: StockInput) => void
  onCancelar: () => void
}

/** Cambio rápido de stock y disponibilidad (PATCH /productos/{id}/stock). */
export default function StockForm({ producto, enviando, error, onGuardar, onCancelar }: Props) {
  const form = useForm({
    defaultValues: { stock: String(producto.stock), disponible: producto.disponible },
    onSubmit: ({ value }) => onGuardar({ stock: Number(value.stock), disponible: value.disponible }),
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
      <p className="mb-3 text-sm text-slate-600">
        <strong>{producto.nombre}</strong> · stock actual: {producto.stock}
      </p>

      <form.Field
        name="stock"
        validators={{
          onChange: ({ value }) => {
            if (value.trim() === '') return 'Ingresá el stock'
            const n = Number(value)
            if (!Number.isInteger(n) || n < 0) return 'Debe ser un entero mayor o igual a 0'
            return undefined
          },
        }}
      >
        {(field) => (
          <Input
            id="stock-nuevo"
            label="Nuevo stock"
            type="number"
            min="0"
            step="1"
            value={field.state.value}
            errors={field.state.meta.errors}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field name="disponible">
        {(field) => (
          <label className="mb-4 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
              className="h-4 w-4 accent-orange-600"
            />
            Disponible para la venta
          </label>
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
