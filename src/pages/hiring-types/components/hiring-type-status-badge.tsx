import { ActiveStateBadge } from '@/components/badges/active-state-badge'
import type { HiringTypeStatus } from '@/services/hiring-types/hiring-types.types'

export function HiringTypeStatusBadge({
  status,
}: {
  status: HiringTypeStatus
}) {
  return <ActiveStateBadge status={status} />
}
