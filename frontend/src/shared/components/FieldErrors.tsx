interface Props {
  errors: unknown[]
}

/** Muestra los errores de validación de un campo de TanStack Form (sin repetir mensajes). */
export default function FieldErrors({ errors }: Props) {
  const mensajes = [
    ...new Set(
      errors
        .filter(Boolean)
        .map((e) => (typeof e === 'string' ? e : String((e as { message?: string }).message ?? e))),
    ),
  ]
  if (mensajes.length === 0) return null
  return (
    <p role="alert" className="mt-1 text-sm text-red-600">
      {mensajes.join(', ')}
    </p>
  )
}
