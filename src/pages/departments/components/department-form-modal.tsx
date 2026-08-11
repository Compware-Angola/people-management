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
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from '@/hooks/departments'
import type {
  CreateDepartmentDTO,
  Department,
} from '@/services/departments/departments.types'
import {
  useDepartmentFormModal,
  type DepartmentFormValues,
} from '../hooks/use-department-form-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  department?: Department | null
}

const statusOptions = [
  { label: 'Ativo', value: '1' },
  { label: 'Inativo', value: '0' },
]

function buildPayload(values: DepartmentFormValues): CreateDepartmentDTO {
  return {
    description: values.description,
    status: Number(values.status) as CreateDepartmentDTO['status'],
  }
}

export function DepartmentFormModal({
  open,
  onOpenChange,
  department,
}: Props) {
  const isEdit = Boolean(department)
  const { mutateAsync: createDepartment } = useCreateDepartmentMutation()
  const { mutateAsync: updateDepartment } = useUpdateDepartmentMutation()

  const { form, canSubmit, isLoading } = useDepartmentFormModal({
    open,
    department,
    onSave: async (values) => {
      const payload = buildPayload(values)

      if (department) {
        await updateDepartment({
          code: department.code,
          data: payload,
        })
      } else {
        await createDepartment(payload)
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
            {isEdit ? 'Editar Departamento' : 'Novo Departamento'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize a descrição e o estado do departamento.'
              : 'Cadastre um novo departamento para ser usado nos fluxos de pessoas.'}
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
                placeholder="Ex: Recursos Humanos"
              />
            )}
          </form.AppField>

          <form.AppField name="status">
            {(field) => (
              <field.SelectField label="Estado" options={statusOptions} />
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
