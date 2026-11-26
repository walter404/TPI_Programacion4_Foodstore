import { useForm } from '@tanstack/react-form'
import { useCategorias } from '@/features/categorias'
import FieldErrors from '@/shared/components/FieldErrors'
import Alerta from '@/shared/ui/Alerta'
import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import type { Producto, ProductoInput } from '../types/producto'

interface Props {
  /** Producto a editar; sin él, el formulario es de alta. */
  producto: Producto | null
  enviando: boolean
  error: string | null
  onGuardar: (input: ProductoInput) => void
  onCancelar: () => void
}

const campoClase =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500'

export default function ProductoForm({ producto, enviando, error, onGuardar, onCancelar }: Props) {
  const { data: categorias = [] } = useCategorias()

  const form = useForm({
    defaultValues: {
      categoria_id: producto ? String(producto.categoria_id) : '',
      nombre: producto?.nombre ?? '',
      descripcion: producto?.descripcion ?? '',
      precio_base: producto ? String(producto.precio_base) : '',
      imagen_url: producto?.imagen_url ?? '',
      stock: producto ? String(producto.stock) : '0',
      disponible: producto?.disponible ?? true,
    },
    onSubmit: ({ value }) =>
      onGuardar({
        categoria_id: Number(value.categoria_id),
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim() || null,
        precio_base: Number(value.precio_base),
        imagen_url: value.imagen_url.trim() || null,
        stock: Number(value.stock),
        disponible: value.disponible,
      }),
  })

  // Si el producto pertenece a una categoría dada de baja, igual se muestra para no perder el valor.
  const opciones = producto && !categorias.some((c) => c.id === producto.categoria_id) ? [...categorias, producto.categoria] : categorias

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
            if (v.length > 150) return 'Máximo 150 caracteres'
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
        name="categoria_id"
        validators={{ onChange: ({ value }) => (value === '' ? 'Elegí una categoría' : undefined) }}
      >
        {(field) => (
          <div className="mb-3">
            <label htmlFor="categoria_id" className="mb-1 block text-sm font-medium text-slate-700">
              Categoría
            </label>
            <select
              id="categoria_id"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className={campoClase}
            >
              <option value="">Seleccioná...</option>
              {opciones.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            <FieldErrors errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      <form.Field
        name="descripcion"
        validators={{ onChange: ({ value }) => (value.length > 1000 ? 'Máximo 1000 caracteres' : undefined) }}
      >
        {(field) => (
          <div className="mb-3">
            <label htmlFor="descripcion" className="mb-1 block text-sm font-medium text-slate-700">
              Descripción (opcional)
            </label>
            <textarea
              id="descripcion"
              rows={2}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className={campoClase}
            />
            <FieldErrors errors={field.state.meta.errors} />
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-3">
        <form.Field
          name="precio_base"
          validators={{
            onChange: ({ value }) => {
              if (value.trim() === '') return 'Ingresá el precio'
              const n = Number(value)
              if (Number.isNaN(n) || n < 0) return 'Debe ser un número mayor o igual a 0'
              return undefined
            },
          }}
        >
          {(field) => (
            <Input
              id="precio_base"
              label="Precio"
              type="number"
              min="0"
              step="0.01"
              value={field.state.value}
              errors={field.state.meta.errors}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>

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
              id="stock"
              label="Stock"
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
      </div>

      <form.Field
        name="imagen_url"
        validators={{
          onChange: ({ value }) => {
            const v = value.trim()
            if (v === '') return undefined
            if (!/^https?:\/\//i.test(v)) return 'Debe empezar con http:// o https://'
            if (v.length > 500) return 'Máximo 500 caracteres'
            return undefined
          },
        }}
      >
        {(field) => (
          <Input
            id="imagen_url"
            label="URL de la imagen (opcional)"
            placeholder="https://..."
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
