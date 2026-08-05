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
  useBiometricEquipmentFormModal,
  type BiometricEquipmentFormValues,
} from '../hooks/use-biometric-equipment-form-modal'
import {
  useCreateBiometricEquipmentMutation,
  useUpdateBiometricEquipmentMutation,
} from '@/hooks/biometrics'
import type {
  BiometricEquipment,
  CreateBiometricEquipmentDTO,
} from '@/services/biometrics/biometrics.types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  equipment?: BiometricEquipment | null
}

const statusOptions = [
  { label: 'Ativo', value: '1' },
  { label: 'Inativo', value: '0' },
]

function buildPayload(
  values: BiometricEquipmentFormValues,
): CreateBiometricEquipmentDTO {
  return {
    name: values.name,
    ...(values.location ? { location: values.location } : {}),
    ...(values.model ? { model: values.model } : {}),
    status: Number(values.status),
  }
}

export function BiometricEquipmentFormModal({
  open,
  onOpenChange,
  equipment,
}: Props) {
  const isEdit = Boolean(equipment)
  const { mutateAsync: createEquipment } =
    useCreateBiometricEquipmentMutation()
  const { mutateAsync: updateEquipment } =
    useUpdateBiometricEquipmentMutation()

  const { form, canSubmit, isLoading } = useBiometricEquipmentFormModal({
    open,
    equipment,
    onSave: async (values) => {
      const payload = buildPayload(values)

      if (equipment) {
        await updateEquipment({
          id: String(equipment.id),
          data: payload,
        })
      } else {
        await createEquipment(payload)
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
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Equipamento' : 'Cadastrar Equipamento'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os dados do equipamento biométrico.'
              : 'Preencha os dados do equipamento biométrico.'}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.AppField name="name">
            {(field) => (
              <field.TextField
                label="Nome"
                placeholder="Ex: Leitor Biométrico Entrada"
              />
            )}
          </form.AppField>

          <div className="grid gap-4 md:grid-cols-2">
            <form.AppField name="location">
              {(field) => (
                <field.TextField
                  label="Localização"
                  placeholder="Ex: Recepção"
                />
              )}
            </form.AppField>

            <form.AppField name="model">
              {(field) => (
                <field.TextField
                  label="Modelo"
                  placeholder="Ex: Digital Persona 4500"
                />
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
              {isEdit ? 'Guardar alterações' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
