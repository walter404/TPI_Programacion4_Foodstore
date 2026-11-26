import Button from './Button'
import Modal from './Modal'

interface Props {
  abierto: boolean
  titulo: string
  mensaje: string
  textoConfirmar?: string
  procesando?: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ConfirmDialog({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  procesando = false,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <Modal abierto={abierto} titulo={titulo} onCerrar={onCancelar}>
      <p className="mb-5 text-sm text-slate-600">{mensaje}</p>
      <div className="flex justify-end gap-2">
        <Button variante="secundario" onClick={onCancelar}>
          Volver
        </Button>
        <Button variante="peligro" onClick={onConfirmar} disabled={procesando}>
          {procesando ? 'Procesando...' : textoConfirmar}
        </Button>
      </div>
    </Modal>
  )
}
