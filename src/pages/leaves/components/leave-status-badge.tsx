import { Badge } from '@/components/ui/badge'
import type { LeaveStatus } from '@/services/leaves/leaves.types'

const statusLabels: Record<LeaveStatus, string> = {
  PENDENTE: 'Pendente',
  APROVADA: 'Aprovada',
  REJEITADA: 'Rejeitada',
  CANCELADA: 'Cancelada',
}

export function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  if (status === 'APROVADA') {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 ring-emerald-200 hover:bg-emerald-100">
        {statusLabels[status]}
      </Badge>
    )
  }

  if (status === 'REJEITADA') {
    return <Badge variant="destructive">{statusLabels[status]}</Badge>
  }

  if (status === 'CANCELADA') {
    return <Badge variant="outline">{statusLabels[status]}</Badge>
  }

  return <Badge variant="secondary">{statusLabels[status]}</Badge>
}
