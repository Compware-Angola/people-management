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
import { useDepartmentsQuery } from '@/hooks/departments'
import {
  useCreatePermissionGroupMutation,
  useUpdatePermissionGroupMutation,
} from '@/hooks/permissions'
import type {
  CreateGroupDTO,
  PermissionGroup,
} from '@/services/permissions/permissions.types'
import {
  usePermissionGroupFormModal,
  type PermissionGroupFormValues,
} from '../hooks/use-permission-group-form-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  group?: PermissionGroup | null
}

const statusOptions = [
  { label: 'Ativo', value: '1' },
  { label: 'Inativo', value: '0' },
]

function buildPayload(values: PermissionGroupFormValues): CreateGroupDTO {
  return {
    description: values.description,
    status: Number(values.status) as CreateGroupDTO['status'],
    ...(values.departmentId !== 'none'
      ? { departmentId: Number(values.departmentId) }
      : {}),
  }
}

export function PermissionGroupFormModal({
  open,
  onOpenChange,
  group,
}: Props) {
  const isEdit = Boolean(group)
  const { mutateAsync: createGroup } = useCreatePermissionGroupMutation()
  const { mutateAsync: updateGroup } = useUpdatePermissionGroupMutation()
  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useDepartmentsQuery({
      page: 1,
      limit: 100,
      status: 1,
    })

  const departmentOptions = [
    { label: 'Sem departamento', value: 'none' },
    ...(departmentsData?.data ?? []).map((department) => ({
      label: department.description,
      value: String(department.code),
    })),
  ]

  const { form, canSubmit, isLoading } = usePermissionGroupFormModal({
    open,
    group,
    onSave: async (values) => {
      const payload = buildPayload(values)

      if (group) {
        await updateGroup({
          id: group.id,
          data: payload,
        })
      } else {
        await createGroup(payload)
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
            {isEdit ? 'Editar Grupo de Permissão' : 'Novo Grupo de Permissão'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os dados básicos do grupo de permissão.'
              : 'Cadastre um grupo para depois associar usuários e permissões.'}
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
              <field.TextField label="Descrição" placeholder="Ex: RH" />
            )}
          </form.AppField>

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
