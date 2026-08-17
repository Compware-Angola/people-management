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
  useCreateCostCenterMutation,
  useUpdateCostCenterMutation,
} from '@/hooks/cost-centers'
import { useDepartmentsQuery } from '@/hooks/departments'
import type {
  CostCenter,
  CreateCostCenterDTO,
} from '@/services/cost-centers/cost-centers.types'
import {
  useCostCenterFormModal,
  type CostCenterFormValues,
} from '../hooks/use-cost-center-form-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  costCenter?: CostCenter | null
}

const statusOptions = [
  { label: 'Ativo', value: '1' },
  { label: 'Inativo', value: '0' },
]

function buildPayload(values: CostCenterFormValues): CreateCostCenterDTO {
  return {
    departmentId: Number(values.departmentId),
    description: values.description,
    status: Number(values.status) as CreateCostCenterDTO['status'],
  }
}

export function CostCenterFormModal({
  open,
  onOpenChange,
  costCenter,
}: Props) {
  const isEdit = Boolean(costCenter)
  const { mutateAsync: createCostCenter } = useCreateCostCenterMutation()
  const { mutateAsync: updateCostCenter } = useUpdateCostCenterMutation()
  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useDepartmentsQuery({ page: 1, limit: 100, status: 1 })

  const departmentOptions =
    departmentsData?.data.map((department) => ({
      label: department.description,
      value: String(department.code),
    })) ?? []

  const { form, canSubmit, isLoading } = useCostCenterFormModal({
    open,
    costCenter,
    onSave: async (values) => {
      const payload = buildPayload(values)

      try {
        if (costCenter) {
          await updateCostCenter({
            code: costCenter.code,
            data: payload,
          })
        } else {
          await createCostCenter(payload)
        }

        onOpenChange(false)
      } catch {
        // A mutation ja apresenta a mensagem devolvida pela API.
      }
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
            {isEdit ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize o departamento, a descrição e o estado do centro de custo.'
              : 'Cadastre um novo centro de custo vinculado a um departamento.'}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.AppField name="departmentId">
            {(field) => (
              <field.SelectField
                label="Departamento"
                placeholder={
                  isLoadingDepartments
                    ? 'Carregando departamentos...'
                    : 'Selecionar departamento'
                }
                options={departmentOptions}
              />
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => (
              <field.TextField
                label="Descrição"
                placeholder="Ex: Centro de custo administrativo"
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
