import Card from '@/shared/ui/Card'

interface Props {
  titulo: string
  valor: string | number
  acento?: string
}

export default function ResumenCard({ titulo, valor, acento = 'text-slate-800' }: Props) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-slate-500">{titulo}</p>
      <p className={`mt-1 text-3xl font-bold ${acento}`}>{valor}</p>
    </Card>
  )
}
