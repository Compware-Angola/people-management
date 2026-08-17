import { ActiveStateBadge } from '@/components/badges/active-state-badge'
import type { PositionStatus } from '@/services/positions/positions.types'

export function PositionStatusBadge({ status }: { status: PositionStatus }) {
  return <ActiveStateBadge status={status} />
}
