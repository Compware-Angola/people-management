import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type {
  SalaryProcessing,
  SalaryProcessingValidationStatus,
} from '@/services/salary-processing/salary-processing.types'

export type SalaryProcessingAction = 'close' | 'reject' | 'reprocess'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  processing?: SalaryProcessing | null
  action?: SalaryProcessingAction | null
  loading?: boolean
  onConfirm: () => Promise<void>
}

const actionText: Record<
  SalaryProcessingAction,
  {
    title: string
    description: string
    confirmLabel: string
    status?: SalaryProcessingValidationStatus
  }
> = {
  close: {
    title: 'Fechar processamento',
    description:
      'Esta ação valida o processamento salarial e marca o registo como fechado.',
    confirmLabel: 'Fechar',
    status: 'FECHADO',
  },
  reject: {
    title: 'Recusar processamento',
    description:
      'Esta ação marca o processamento salarial como recusado para impedir a sua continuidade.',
    confirmLabel: 'Recusar',
    status: 'RECUSADO',
  },
  reprocess: {
    title: 'Reprocessar salários',
    description:
      'Esta ação cria uma nova tentativa de processamento a partir do registo selecionado.',
    confirmLabel: 'Reprocessar',
  },
}

export function SalaryProcessingActionDialog({
  open,
  onOpenChange,
  processing,
  action,
  loading,
  onConfirm,
}: Props) {
  const text = action ? actionText[action] : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{text?.title ?? 'Confirmar ação'}</DialogTitle>
          <DialogDescription>
            {text?.description}{' '}
            {processing ? `Processamento #${processing.id}.` : ''}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="button" disabled={loading} onClick={() => void onConfirm()}>
            {text?.confirmLabel ?? 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
