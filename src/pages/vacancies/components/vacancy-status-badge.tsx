import { Badge } from '@/components/ui/badge'
import type { VacancyStateValue } from '@/services/vacancies/vacancies.types'

const variantByState: Record<string, string> = {
  RASCUNHO: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
  AGENDADA: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  PUBLICADA: 'bg-green-100 text-green-700 hover:bg-green-100',
  SUSPENSA: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  ENCERRADA: 'bg-zinc-100 text-zinc-700 hover:bg-zinc-100',
  CANCELADA: 'bg-red-100 text-red-700 hover:bg-red-100',
}

type Props = {
  acronym?: VacancyStateValue | null
  description?: string | null
}

export function VacancyStatusBadge({ acronym, description }: Props) {
  const state = acronym ?? ''

  return (
    <Badge className={variantByState[state] ?? 'bg-muted text-foreground'}>
      {description || state || '-'}
    </Badge>
  )
}
