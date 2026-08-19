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
  useCreateSalaryMutation,
  useUpdateSalaryMutation,
} from '@/hooks/salaries'
import type {
  CreateSalaryDTO,
  Salary,
  UpdateSalaryDTO,
} from '@/services/salaries/salaries.types'
import {
  useSalaryFormModal,
  type SalaryFormValues,
} from '../hooks/use-salary-form-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  salary?: Salary | null
}

const statusOptions = [
  { label: 'Ativo', value: '1' },
  { label: 'Inativo', value: '0' },
]

function buildCreatePayload(values: SalaryFormValues): CreateSalaryDTO {
  return {
    position: values.position,
    category: values.category,
    description: values.description || undefined,
    baseSalary: Number(values.baseSalary),
  }
}

function buildUpdatePayload(values: SalaryFormValues): UpdateSalaryDTO {
  return {
    ...buildCreatePayload(values),
    status: Number(values.status) as UpdateSalaryDTO['status'],
  }
}

export function SalaryFormModal({ open, onOpenChange, salary }: Props) {
  const isEdit = Boolean(salary)
  const { mutateAsync: createSalary } = useCreateSalaryMutation()
  const { mutateAsync: updateSalary } = useUpdateSalaryMutation()

  const { form, canSubmit, isLoading } = useSalaryFormModal({
    open,
    salary,
    onSave: async (values) => {
      if (salary) {
        await updateSalary({
          id: salary.id,
          data: buildUpdatePayload(values),
        })
      } else {
        await createSalary(buildCreatePayload(values))
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Estrutura Salarial' : 'Nova Estrutura Salarial'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os dados da estrutura salarial selecionada.'
              : 'Cadastre uma estrutura salarial para posterior associação aos colaboradores.'}
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
            <form.AppField name="position">
              {(field) => (
                <field.TextField
                  label="Cargo"
                  placeholder="Ex: Gestor de Recursos Humanos"
                />
              )}
            </form.AppField>

            <form.AppField name="category">
              {(field) => (
                <field.TextField
                  label="Categoria"
                  placeholder="Ex: Administrativo"
                />
              )}
            </form.AppField>

            <form.AppField name="baseSalary">
              {(field) => (
                <field.TextField
                  label="Salário base"
                  type="number"
                  min="0"
                  max="99999999.99"
                  step="0.01"
                  placeholder="Ex: 150000"
                />
              )}
            </form.AppField>

            <form.AppField name="status">
              {(field) => (
                <field.SelectField label="Estado" options={statusOptions} />
              )}
            </form.AppField>
          </div>

          <form.AppField name="description">
            {(field) => (
              <field.TextareaField
                label="Descrição"
                placeholder="Informações adicionais sobre a estrutura salarial"
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
