import { Badge } from '@/components/ui/badge'
import type { RequisitionStateAcronym } from '@/services/requisitions/requisitions.types'

const statusLabels: Record<string, string> = {
  RASCUNHO: 'Rascunho',
  AGUARDANDO_RH: 'Aguardando RH',
  AGUARDANDO_FINANCEIRO: 'Aguardando financeiro',
  APROVADA: 'Aprovada',
  APROVADA_PARCIALMENTE: 'Aprovada parcialmente',
  REJEITADA: 'Rejeitada',
  CANCELADA: 'Cancelada',
}

type Props = {
  acronym?: RequisitionStateAcronym | string | null
  description?: string | null
}

export function RequisitionStatusBadge({ acronym, description }: Props) {
  const label = description || (acronym ? statusLabels[acronym] : null) || '-'

  if (acronym === 'APROVADA' || acronym === 'APROVADA_PARCIALMENTE') {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 ring-emerald-200 hover:bg-emerald-100">
        {label}
      </Badge>
    )
  }

  if (acronym === 'REJEITADA') {
    return <Badge variant="destructive">{label}</Badge>
  }

  if (acronym === 'CANCELADA') {
    return <Badge variant="outline">{label}</Badge>
  }

  if (acronym === 'AGUARDANDO_RH' || acronym === 'AGUARDANDO_FINANCEIRO') {
    return (
      <Badge className="bg-amber-100 text-amber-700 ring-amber-200 hover:bg-amber-100">
        {label}
      </Badge>
    )
  }

  return <Badge variant="secondary">{label}</Badge>
}
