import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Save, X } from 'lucide-react'
import { useCreateSalaryProcessingMutation } from '@/hooks/salary-processing'
import type { CreateSalaryProcessingDTO } from '@/services/salary-processing/salary-processing.types'
import {
  useSalaryProcessingFormModal,
  type SalaryProcessingFormValues,
} from '../hooks/use-salary-processing-form-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function buildPayload(
  values: SalaryProcessingFormValues,
): CreateSalaryProcessingDTO {
  return {
    startDate: values.startDate,
    endDate: values.endDate,
  }
}

export function SalaryProcessingFormModal({ open, onOpenChange }: Props) {
  const { mutateAsync: createProcessing } =
    useCreateSalaryProcessingMutation()

  const { form, canSubmit, isLoading } = useSalaryProcessingFormModal({
    open,
    onSave: async (values) => {
      await createProcessing(buildPayload(values))
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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Novo Processamento Salarial</DialogTitle>
          <DialogDescription>
            Informe o período que deve ser considerado no processamento.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <form.AppField name="startDate">
              {(field) => (
                <field.TextField label="Data de início" type="date" />
              )}
            </form.AppField>

            <form.AppField name="endDate">
              {(field) => <field.TextField label="Data de fim" type="date" />}
            </form.AppField>
          </div>

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
              Processar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
