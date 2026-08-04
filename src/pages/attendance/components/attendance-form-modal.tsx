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
  useAttendanceFormModal,
  type AttendanceFormValues,
} from '../hooks/use-attendance-form-modal'
import { useEmployeesQuery } from '@/hooks/employees'
import {
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
} from '@/hooks/attendance'
import type {
  Attendance,
  AttendanceSituation,
  CreateAttendanceDTO,
} from '@/services/attendance/attendance.types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  attendance?: Attendance | null
}

const situationOptions: { label: string; value: AttendanceSituation }[] = [
  { label: 'Presente', value: 'PRESENTE' },
  { label: 'Falta', value: 'FALTA' },
  { label: 'Licença', value: 'LICENCA' },
  { label: 'Férias', value: 'FERIAS' },
  { label: 'Atraso', value: 'ATRASO' },
]

function toIsoDate(value: string) {
  return new Date(value).toISOString()
}

function buildPayload(values: AttendanceFormValues): CreateAttendanceDTO {
  return {
    employeeId: Number(values.employeeId),
    startDate: toIsoDate(values.startDate),
    ...(values.endDate ? { endDate: toIsoDate(values.endDate) } : {}),
    ...(values.hours ? { hours: Number(values.hours) } : {}),
    situation: values.situation,
  }
}

export function AttendanceFormModal({
  open,
  onOpenChange,
  attendance,
}: Props) {
  const isEdit = Boolean(attendance)
  const { mutateAsync: createAttendance } = useCreateAttendanceMutation()
  const { mutateAsync: updateAttendance } = useUpdateAttendanceMutation()
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

  const { form, canSubmit, isLoading } = useAttendanceFormModal({
    open,
    attendance,
    onSave: async (values) => {
      const payload = buildPayload(values)

      if (attendance) {
        await updateAttendance({
          id: String(attendance.id),
          data: payload,
        })
      } else {
        await createAttendance(payload)
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
      <DialogContent className="max-h-[90vh] max-w-2xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Assiduidade' : 'Registrar Assiduidade'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os dados do registro de assiduidade.'
              : 'Escolha o colaborador e preencha os dados da assiduidade.'}
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
                <field.TextField label="Data de início" type="datetime-local" />
              )}
            </form.AppField>

            <form.AppField name="endDate">
              {(field) => (
                <field.TextField label="Data de fim" type="datetime-local" />
              )}
            </form.AppField>

            <form.AppField name="hours">
              {(field) => (
                <field.TextField
                  label="Horas"
                  type="number"
                  min="0"
                  max="999.99"
                  step="0.01"
                  placeholder="Ex: 8"
                />
              )}
            </form.AppField>

            <form.AppField name="situation">
              {(field) => (
                <field.SelectField
                  label="Situação"
                  options={situationOptions}
                />
              )}
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
              {isEdit ? 'Guardar alterações' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
