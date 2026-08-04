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
import {
  useVacationFormModal,
  type VacationFormValues,
} from '../hooks/use-vacation-form-modal'
import { useEmployeesQuery } from '@/hooks/employees'
import {
  useCreateVacationMutation,
  useUpdateVacationMutation,
} from '@/hooks/vacations'
import type {
  CreateVacationDTO,
  Vacation,
  VacationStatus,
} from '@/services/vacations/vacations.types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vacation?: Vacation | null
}

const statusOptions: { label: string; value: VacationStatus }[] = [
  { label: 'Pendente', value: 'PENDENTE' },
  { label: 'Aprovado', value: 'APROVADO' },
  { label: 'Reprovado', value: 'REPROVADO' },
  { label: 'Cancelado', value: 'CANCELADO' },
]

function optionalNumber(value?: string) {
  return value ? Number(value) : undefined
}

function buildPayload(values: VacationFormValues): CreateVacationDTO {
  return {
    employeeId: Number(values.employeeId),
    startDate: values.startDate,
    endDate: values.endDate,
    days: Number(values.days),
    ...(values.observation ? { observation: values.observation } : {}),
    ...(optionalNumber(values.approverManagerId)
      ? { approverManagerId: optionalNumber(values.approverManagerId) }
      : {}),
    ...(optionalNumber(values.approverRhId)
      ? { approverRhId: optionalNumber(values.approverRhId) }
      : {}),
    status: values.status,
  }
}

export function VacationFormModal({ open, onOpenChange, vacation }: Props) {
  const isEdit = Boolean(vacation)
  const { mutateAsync: createVacation } = useCreateVacationMutation()
  const { mutateAsync: updateVacation } = useUpdateVacationMutation()
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

  const { form, canSubmit, isLoading } = useVacationFormModal({
    open,
    vacation,
    onSave: async (values) => {
      const payload = buildPayload(values)

      if (vacation) {
        await updateVacation({
          id: String(vacation.id),
          data: payload,
        })
      } else {
        await createVacation(payload)
      }

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
          <DialogTitle>{isEdit ? 'Editar Férias' : 'Registrar Férias'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os dados do registro de férias.'
              : 'Escolha o colaborador e preencha o período das férias.'}
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
            <form.AppField name="startDate">
              {(field) => (
                <field.TextField label="Data de início" type="date" />
              )}
            </form.AppField>

            <form.AppField name="endDate">
              {(field) => <field.TextField label="Data de fim" type="date" />}
            </form.AppField>

            <form.AppField name="days">
              {(field) => (
                <field.TextField
                  label="Dias"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ex: 30"
                />
              )}
            </form.AppField>

            <form.AppField name="status">
              {(field) => (
                <field.SelectField label="Estado" options={statusOptions} />
              )}
            </form.AppField>

            <form.AppField name="approverManagerId">
              {(field) => (
                <field.ComboboxField
                  label="Gestor aprovador"
                  placeholder="Selecionar gestor"
                  emptyMessage="Nenhum colaborador encontrado."
                  options={employeeOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="approverRhId">
              {(field) => (
                <field.ComboboxField
                  label="RH aprovador"
                  placeholder="Selecionar RH"
                  emptyMessage="Nenhum colaborador encontrado."
                  options={employeeOptions}
                />
              )}
            </form.AppField>
          </div>

          <form.AppField name="observation">
            {(field) => (
              <field.TextareaField
                label="Observação"
                placeholder="Informações adicionais sobre o registro"
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
              {isEdit ? 'Guardar alterações' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
