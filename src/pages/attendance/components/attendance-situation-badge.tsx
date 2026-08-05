import { Badge } from '@/components/ui/badge'
import type { AttendanceSituation } from '@/services/attendance/attendance.types'

const situationLabel: Record<AttendanceSituation, string> = {
  PRESENTE: 'Presente',
  FALTA: 'Falta',
  LICENCA: 'Licença',
  FERIAS: 'Férias',
  ATRASO: 'Atraso',
}

export function AttendanceSituationBadge({
  situation,
}: {
  situation: AttendanceSituation
}) {
  if (situation === 'PRESENTE') {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 ring-emerald-200 hover:bg-emerald-100">
        {situationLabel[situation]}
      </Badge>
    )
  }

  const variant =
    situation === 'FALTA'
      ? 'destructive'
      : 'secondary'

  return <Badge variant={variant}>{situationLabel[situation]}</Badge>
}
