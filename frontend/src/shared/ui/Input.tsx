import type { InputHTMLAttributes } from 'react'
import FieldErrors from '@/shared/components/FieldErrors'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  errors?: unknown[]
}

/** Campo de texto con etiqueta y errores. Se usa dentro de los `form.Field` de TanStack Form. */
export default function Input({ id, label, errors = [], className = '', ...resto }: Props) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 ${className}`}
        {...resto}
      />
      <FieldErrors errors={errors} />
    </div>
  )
}
