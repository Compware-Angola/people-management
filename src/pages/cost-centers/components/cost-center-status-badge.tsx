import { ActiveStateBadge } from '@/components/badges/active-state-badge'
import type { CostCenterStatus } from '@/services/cost-centers/cost-centers.types'

export function CostCenterStatusBadge({
  status,
}: {
  status: CostCenterStatus
}) {
  return <ActiveStateBadge status={status} />
}
