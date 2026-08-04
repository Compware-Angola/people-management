import { Badge } from '@/components/ui/badge'

export function NumericStatusBadge({ status }: { status: number }) {
  if (Number(status) === 1) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 ring-emerald-200 hover:bg-emerald-100">
        Ativo
      </Badge>
    )
  }

  return <Badge variant="secondary">Inativo</Badge>
}
