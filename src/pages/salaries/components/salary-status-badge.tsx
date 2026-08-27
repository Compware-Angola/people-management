import { ActiveStateBadge } from '@/components/badges/active-state-badge'
import type { SalaryStatus } from '@/services/salaries/salaries.types'

export function SalaryStatusBadge({ status }: { status: SalaryStatus }) {
  return <ActiveStateBadge status={status} />
}
