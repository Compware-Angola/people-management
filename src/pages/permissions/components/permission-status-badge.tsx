import { Badge } from '@/components/ui/badge'
import type { PermissionStatus } from '@/services/permissions/permissions.types'

type Props = {
  status: PermissionStatus
}

export function PermissionStatusBadge({ status }: Props) {
  if (status === 1) {
    return <Badge className="bg-emerald-600 hover:bg-emerald-600">Ativa</Badge>
  }

  return <Badge variant="secondary">Inativa</Badge>
}
