import { Badge } from '@/components/ui/badge'
import type { VacationStatus } from '@/services/vacations/vacations.types'

const statusLabels: Record<VacationStatus, string> = {
  PENDENTE: 'Pendente',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  CANCELADO: 'Cancelado',
}

export function VacationStatusBadge({ status }: { status: VacationStatus }) {
  if (status === 'APROVADO') {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 ring-emerald-200 hover:bg-emerald-100">
        {statusLabels[status]}
      </Badge>
    )
  }

  if (status === 'REPROVADO') {
    return <Badge variant="destructive">{statusLabels[status]}</Badge>
  }

  if (status === 'CANCELADO') {
    return <Badge variant="outline">{statusLabels[status]}</Badge>
  }

  return <Badge variant="secondary">{statusLabels[status]}</Badge>
}
