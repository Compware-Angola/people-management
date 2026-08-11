import { Badge } from '@/components/ui/badge'
import type { PositionStatus } from '@/services/positions/positions.types'

export function PositionStatusBadge({ status }: { status: PositionStatus }) {
  if (status === 1) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 ring-emerald-200 hover:bg-emerald-100">
        Ativo
      </Badge>
    )
  }

  return <Badge variant="outline">Inativo</Badge>
}
