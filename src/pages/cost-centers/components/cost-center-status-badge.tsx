import { Badge } from '@/components/ui/badge'
import type { CostCenterStatus } from '@/services/cost-centers/cost-centers.types'

export function CostCenterStatusBadge({
  status,
}: {
  status: CostCenterStatus
}) {
  if (status === 1) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 ring-emerald-200 hover:bg-emerald-100">
        Ativo
      </Badge>
    )
  }

  return <Badge variant="outline">Inativo</Badge>
}
