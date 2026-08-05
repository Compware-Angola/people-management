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
import { useEmployeesQuery } from '@/hooks/employees'
import {
  useBiometricEquipmentsQuery,
  useCreateBiometricIntegrationMutation,
} from '@/hooks/biometrics'
import {
  useBiometricIntegrationFormModal,
  type BiometricIntegrationFormValues,
} from '../hooks/use-biometric-integration-form-modal'
import type { CreateBiometricIntegrationDTO } from '@/services/biometrics/biometrics.types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const eventOptions = [
  { label: 'Entrada', value: 'ENTRADA' },
  { label: 'Saída', value: 'SAIDA' },
  { label: 'Intervalo', value: 'INTERVALO' },
]

const statusOptions = [
  { label: 'Ativo', value: '1' },
  { label: 'Inativo', value: '0' },
]

function buildPayload(
  values: BiometricIntegrationFormValues,
): CreateBiometricIntegrationDTO {
  return {
    employeeId: Number(values.employeeId),
    equipmentId: Number(values.equipmentId),
    event: values.event,
    status: Number(values.status),
  }
}

export function BiometricIntegrationFormModal({
  open,
  onOpenChange,
}: Props) {
  const { mutateAsync: createIntegration } =
    useCreateBiometricIntegrationMutation()
  const { data: employeesData, isLoading: isLoadingEmployees } =
    useEmployeesQuery({
      page: 1,
      limit: 100,
    })
  const { data: equipmentsData, isLoading: isLoadingEquipments } =
    useBiometricEquipmentsQuery({
      page: 1,
      limit: 100,
    })

  const employeeOptions =
    employeesData?.data.map((employee) => ({
      label: employee.name,
      value: String(employee.id),
    })) ?? []

  const equipmentOptions =
    equipmentsData?.data.map((equipment) => ({
      label: equipment.name,
      value: String(equipment.id),
    })) ?? []

  const { form, canSubmit, isLoading } = useBiometricIntegrationFormModal({
    open,
    onSave: async (values) => {
      await createIntegration(buildPayload(values))
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
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>Registrar Evento Biométrico</DialogTitle>
          <DialogDescription>
            Escolha o colaborador, o equipamento e o tipo de evento.
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

          <form.AppField name="equipmentId">
            {(field) => (
              <field.ComboboxField
                label="Equipamento"
                placeholder={
                  isLoadingEquipments
                    ? 'Carregando equipamentos...'
                    : 'Selecionar equipamento'
                }
                emptyMessage="Nenhum equipamento encontrado."
                options={equipmentOptions}
              />
            )}
          </form.AppField>

          <div className="grid gap-4 md:grid-cols-2">
            <form.AppField name="event">
              {(field) => (
                <field.SelectField label="Evento" options={eventOptions} />
              )}
            </form.AppField>

            <form.AppField name="status">
              {(field) => (
                <field.SelectField label="Estado" options={statusOptions} />
              )}
            </form.AppField>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => handleOpenChange(false)}
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
