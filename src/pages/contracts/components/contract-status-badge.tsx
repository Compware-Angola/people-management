import { Badge } from '@/components/ui/badge'
import type { ContractStatus } from '@/services/contracts/contracts.types'

export function ContractStatusBadge({ status }: { status: ContractStatus }) {
  if (status === 'ATIVO') {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        Ativo
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="text-muted-foreground">
      Inativo
    </Badge>
  )
}
