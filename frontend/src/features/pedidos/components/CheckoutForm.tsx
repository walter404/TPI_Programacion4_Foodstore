import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleApiError } from '@/shared/api/handleApiError'
import FieldErrors from '@/shared/components/FieldErrors'
import Alerta from '@/shared/ui/Alerta'
import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import { useCartStore } from '@/store/cartStore'
import { useCrearPedido } from '../hooks/useCrearPedido'
import type { FormaPago } from '../types/pedido'

export default function CheckoutForm() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const vaciar = useCartStore((s) => s.vaciar)
  const { mutateAsync: crearPedido } = useCrearPedido()
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { direccion_entrega: '', forma_pago: 'EFECTIVO' as FormaPago, notas: '' },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        await crearPedido({
          items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
          forma_pago: value.forma_pago,
          direccion_entrega: value.direccion_entrega.trim(),
          notas: value.notas.trim() || null,
        })
        vaciar() // solo se vacía si el servidor confirmó el pedido
        navigate('/mis-pedidos', { replace: true })
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
        name="direccion_entrega"
        validators={{
          onChange: ({ value }) => {
            const v = value.trim()
            if (v === '') return 'La dirección es obligatoria'
            if (v.length < 5) return 'Mínimo 5 caracteres'
            if (v.length > 200) return 'Máximo 200 caracteres'
            return undefined
          },
        }}
      >
        {(field) => (
          <Input
            id="direccion_entrega"
            label="Dirección de entrega"
            placeholder="Calle, número, piso/depto"
            value={field.state.value}
            errors={field.state.meta.errors}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      <form.Field name="forma_pago">
        {(field) => (
          <fieldset className="mb-3">
            <legend className="mb-1 text-sm font-medium text-slate-700">Forma de pago</legend>
            <div className="flex gap-4">
              {(['EFECTIVO', 'TRANSFERENCIA'] as const).map((opcion) => (
                <label key={opcion} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="forma_pago"
                    value={opcion}
                    checked={field.state.value === opcion}
                    onChange={() => field.handleChange(opcion)}
                    className="accent-orange-600"
                  />
                  {opcion === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'}
                </label>
              ))}
            </div>
            <FieldErrors errors={field.state.meta.errors} />
          </fieldset>
        )}
      </form.Field>

      <form.Field
        name="notas"
        validators={{ onChange: ({ value }) => (value.length > 500 ? 'Máximo 500 caracteres' : undefined) }}
      >
        {(field) => (
          <div className="mb-3">
            <label htmlFor="notas" className="mb-1 block text-sm font-medium text-slate-700">
              Notas (opcional)
            </label>
            <textarea
              id="notas"
              rows={2}
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

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting || items.length === 0}>
            {isSubmitting ? 'Confirmando...' : 'Confirmar pedido'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
