import { Badge } from '@/components/ui/badge'
import type { SalaryProcessingStatus } from '@/services/salary-processing/salary-processing.types'

const statusConfig: Record<
  SalaryProcessingStatus,
  { label: string; className: string }
> = {
  PENDENTE: {
    label: 'Pendente',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  SIMULADO: {
    label: 'Simulado',
    className: 'border-sky-200 bg-sky-50 text-sky-700',
  },
  FECHADO: {
    label: 'Fechado',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  RECUSADO: {
    label: 'Recusado',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
  },
  CANCELADO: {
    label: 'Cancelado',
    className: 'border-zinc-200 bg-zinc-50 text-zinc-700',
  },
}

export function SalaryProcessingStatusBadge({
  status,
}: {
  status: SalaryProcessingStatus
}) {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'border-zinc-200 bg-zinc-50 text-zinc-700',
  }

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
