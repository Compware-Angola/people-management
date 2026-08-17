import { Badge } from '@/components/ui/badge'

type ActiveStateBadgeProps = {
  status?: number | null
}

export function ActiveStateBadge({ status }: ActiveStateBadgeProps) {
  if (status === 1) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 ring-emerald-200 hover:bg-emerald-100">
        Ativo
      </Badge>
    )
  }

  return <Badge variant="outline">Inativo</Badge>
}
