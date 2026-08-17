import { ActiveStateBadge } from '@/components/badges/active-state-badge'
import type { DepartmentStatus } from '@/services/departments/departments.types'

export function DepartmentStatusBadge({
  status,
}: {
  status: DepartmentStatus
}) {
  return <ActiveStateBadge status={status} />
}
