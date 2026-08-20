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
  useCreateContractMutation,
  useUpdateContractMutation,
} from '@/hooks/contracts'
import type {
  Contract,
  CreateContractDTO,
} from '@/services/contracts/contracts.types'
import {
  useContractFormModal,
  type ContractFormValues,
} from '../hooks/use-contract-form-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract?: Contract | null
}

const typeOptions = [
  { label: 'Contratado', value: 'CONTRATADO' },
  { label: 'Horista', value: 'HORISTA' },
  { label: 'Fixo', value: 'FIXO' },
]

const statusOptions = [
  { label: 'Ativo', value: 'ATIVO' },
  { label: 'Inativo', value: 'INATIVO' },
]

const overtimeOptions = [
  { label: 'Não permite', value: '0' },
  { label: 'Permite', value: '1' },
]

function buildPayload(values: ContractFormValues): CreateContractDTO {
  return {
    type: values.type,
    allowsOvertime: Number(values.allowsOvertime),
    monthlyHours: Number(values.monthlyHours),
  }
}

export function ContractFormModal({ open, onOpenChange, contract }: Props) {
  const isEdit = Boolean(contract)
  const { mutateAsync: createContract } = useCreateContractMutation()
  const { mutateAsync: updateContract } = useUpdateContractMutation()

  const { form, canSubmit, isLoading } = useContractFormModal({
    open,
    contract,
    onSave: async (values) => {
      const payload = buildPayload(values)

      if (contract) {
        await updateContract({
          id: contract.id,
          data: {
            ...payload,
            status: values.status,
          },
        })
      } else {
        await createContract(payload)
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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Contrato' : 'Novo Contrato'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize as regras do contrato.'
              : 'Cadastre um tipo de contrato para ser atribuído aos colaboradores.'}
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
            <form.AppField name="type">
              {(field) => (
                <field.SelectField label="Tipo" options={typeOptions} />
              )}
            </form.AppField>

            <form.AppField name="monthlyHours">
              {(field) => (
                <field.TextField
                  label="Horas mensais"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ex: 160"
                />
              )}
            </form.AppField>

            <form.AppField name="allowsOvertime">
              {(field) => (
                <field.SelectField
                  label="Hora extra"
                  options={overtimeOptions}
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
