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
import { useCreateRubricMutation } from '@/hooks/salaries'
import type { CreateRubricDTO } from '@/services/salaries/salaries.types'
import {
  useRubricFormModal,
  type RubricFormValues,
} from '../hooks/use-rubric-form-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const typeOptions = [
  { label: 'Provento', value: 'PROVENTO' },
  { label: 'Desconto', value: 'DESCONTO' },
]

const valueTypeOptions = [
  { label: 'Fixo', value: 'FIXO' },
  { label: 'Percentual', value: 'PERCENTUAL' },
  { label: 'Hora extra', value: 'HORA_EXTRA' },
]

const statusOptions = [
  { label: 'Ativa', value: '1' },
  { label: 'Inativa', value: '0' },
]

function buildPayload(values: RubricFormValues): CreateRubricDTO {
  return {
    description: values.description,
    type: values.type,
    valueType: values.valueType,
    value: Number(values.value),
    status: Number(values.status) as CreateRubricDTO['status'],
  }
}

export function RubricFormModal({ open, onOpenChange }: Props) {
  const { mutateAsync: createRubric } = useCreateRubricMutation()

  const { form, canSubmit, isLoading } = useRubricFormModal({
    open,
    onSave: async (values) => {
      await createRubric(buildPayload(values))
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Rubrica Salarial</DialogTitle>
          <DialogDescription>
            Cadastre uma rubrica para posteriormente associá-la a uma estrutura
            salarial.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.AppField name="description">
            {(field) => (
              <field.TextField
                label="Descrição"
                placeholder="Ex: Bônus de produtividade"
              />
            )}
          </form.AppField>

          <div className="grid gap-4 md:grid-cols-2">
            <form.AppField name="type">
              {(field) => (
                <field.SelectField label="Tipo" options={typeOptions} />
              )}
            </form.AppField>

            <form.AppField name="valueType">
              {(field) => (
                <field.SelectField
                  label="Tipo de valor"
                  options={valueTypeOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="value">
              {(field) => (
                <field.TextField
                  label="Valor"
                  type="number"
                  min="0"
                  max="99999999.99"
                  step="0.01"
                  placeholder="Ex: 10000"
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
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
