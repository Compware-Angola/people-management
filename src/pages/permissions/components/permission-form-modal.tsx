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
import {
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
} from '@/hooks/permissions'
import type {
  CreatePermissionDTO,
  Permission,
} from '@/services/permissions/permissions.types'
import {
  usePermissionFormModal,
  type PermissionFormValues,
} from '../hooks/use-permission-form-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  permission?: Permission | null
}

const statusOptions = [
  { label: 'Ativa', value: '1' },
  { label: 'Inativa', value: '0' },
]

function buildPayload(values: PermissionFormValues): CreatePermissionDTO {
  return {
    slug: values.slug.trim(),
    description: values.description,
    status: Number(values.status) as CreatePermissionDTO['status'],
  }
}

export function PermissionFormModal({
  open,
  onOpenChange,
  permission,
}: Props) {
  const isEdit = Boolean(permission)
  const { mutateAsync: createPermission } = useCreatePermissionMutation()
  const { mutateAsync: updatePermission } = useUpdatePermissionMutation()

  const { form, canSubmit, isLoading } = usePermissionFormModal({
    open,
    permission,
    onSave: async (values) => {
      const payload = buildPayload(values)

      if (permission) {
        await updatePermission({
          id: permission.id,
          data: payload,
        })
      } else {
        await createPermission(payload)
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
            {isEdit ? 'Editar Permissão' : 'Nova Permissão'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize a sigla, a descrição e o estado da permissão.'
              : 'Cadastre uma permissão para depois associá-la a grupos ou usuários.'}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.AppField name="slug">
            {(field) => (
              <field.TextField
                label="Sigla"
                placeholder="Ex: read:employees"
              />
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => (
              <field.TextField
                label="Descrição"
                placeholder="Ex: Criar requisição de vaga"
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
