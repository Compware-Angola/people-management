import { Badge } from '@/components/ui/badge'

interface Props {
  status: number
}

export function EmployeeStatusBadge({ status }: Props) {
  if (status === 1) {
    return <Badge className="bg-emerald-100 text-emerald-700">Ativo</Badge>
  }

  return <Badge variant="secondary">Inativo</Badge>
}
