import { Loader2, Save, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUpdateLeaveMutation } from '@/hooks/leaves'
import type { Leave, LeaveStatus } from '@/services/leaves/leaves.types'
import {
  useLeaveStatusModal,
  type LeaveStatusFormValues,
} from '../hooks/use-leave-status-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  leave?: Leave | null
}

const statusOptions: { label: string; value: LeaveStatus }[] = [
  { label: 'Pendente', value: 'PENDENTE' },
  { label: 'Aprovada', value: 'APROVADA' },
  { label: 'Rejeitada', value: 'REJEITADA' },
  { label: 'Cancelada', value: 'CANCELADA' },
]

function buildPayload(values: LeaveStatusFormValues) {
  return {
    status: values.status,
    ...(values.observation ? { observation: values.observation } : {}),
  }
}

export function LeaveStatusModal({ open, onOpenChange, leave }: Props) {
  const { mutateAsync: updateLeave } = useUpdateLeaveMutation()
  const { form, canSubmit, isLoading } = useLeaveStatusModal({
    open,
    leave,
    onSave: async (values) => {
      if (!leave) return

      await updateLeave({
        id: String(leave.id),
        data: buildPayload(values),
      })
      onOpenChange(false)
    },
  })

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset()
    }

    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl!">
        <DialogHeader>
          <DialogTitle>Atualizar estado da licença</DialogTitle>
          <DialogDescription>
            Altere o estado da licença selecionada. Para rejeitar ou cancelar,
            informe uma observação.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.AppField name="status">
            {(field) => (
              <field.SelectField label="Estado" options={statusOptions} />
            )}
          </form.AppField>

          <form.AppField name="observation">
            {(field) => (
              <field.TextareaField
                label="Observação"
                placeholder="Motivo ou informação adicional"
              />
            )}
          </form.AppField>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>

            <Button type="submit" disabled={!canSubmit || isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
              Guardar alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
