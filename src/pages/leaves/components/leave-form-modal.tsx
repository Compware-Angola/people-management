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
import { useEmployeesQuery } from '@/hooks/employees'
import { useCreateLeaveMutation } from '@/hooks/leaves'
import type {
  CreateLeaveDTO,
  LeaveType,
} from '@/services/leaves/leaves.types'
import {
  useLeaveFormModal,
  type LeaveFormValues,
} from '../hooks/use-leave-form-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const leaveTypeOptions: { label: string; value: LeaveType }[] = [
  { label: 'Médica', value: 'MEDICA' },
  { label: 'Maternidade', value: 'MATERNIDADE' },
  { label: 'Paternidade', value: 'PATERNIDADE' },
  { label: 'Estudo', value: 'ESTUDO' },
]

function optionalNumber(value?: string) {
  return value ? Number(value) : undefined
}

function buildPayload(values: LeaveFormValues): CreateLeaveDTO {
  const documentId = optionalNumber(values.documentId)

  return {
    employeeId: Number(values.employeeId),
    type: values.type,
    startDate: values.startDate,
    endDate: values.endDate,
    ...(documentId ? { documentId } : {}),
    ...(values.observation ? { observation: values.observation } : {}),
  }
}

export function LeaveFormModal({ open, onOpenChange }: Props) {
  const { mutateAsync: createLeave } = useCreateLeaveMutation()
  const { data: employeesData, isLoading: isLoadingEmployees } =
    useEmployeesQuery({
      page: 1,
      limit: 100,
    })

  const employeeOptions =
    employeesData?.data.map((employee) => ({
      label: employee.name,
      value: String(employee.id),
    })) ?? []

  const { form, canSubmit, isLoading } = useLeaveFormModal({
    open,
    onSave: async (values) => {
      await createLeave(buildPayload(values))
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
      <DialogContent className="max-h-[90vh] max-w-3xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Licença</DialogTitle>
          <DialogDescription>
            Escolha o colaborador, o tipo de licença e o período de ausência.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.AppField name="employeeId">
            {(field) => (
              <field.ComboboxField
                label="Colaborador"
                placeholder={
                  isLoadingEmployees
                    ? 'Carregando colaboradores...'
                    : 'Selecionar colaborador'
                }
                emptyMessage="Nenhum colaborador encontrado."
                options={employeeOptions}
              />
            )}
          </form.AppField>

          <div className="grid gap-4 md:grid-cols-2">
            <form.AppField name="type">
              {(field) => (
                <field.SelectField
                  label="Tipo de licença"
                  options={leaveTypeOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="documentId">
              {(field) => (
                <field.TextField
                  label="Código do documento"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Opcional"
                />
              )}
            </form.AppField>

            <form.AppField name="startDate">
              {(field) => (
                <field.TextField label="Data de início" type="date" />
              )}
            </form.AppField>

            <form.AppField name="endDate">
              {(field) => <field.TextField label="Data de fim" type="date" />}
            </form.AppField>
          </div>

          <form.AppField name="observation">
            {(field) => (
              <field.TextareaField
                label="Observação"
                placeholder="Informações adicionais sobre a licença"
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
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
