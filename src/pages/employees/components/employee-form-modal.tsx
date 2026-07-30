import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Save, X } from 'lucide-react'
import { useEmployeeFormModal } from '../hooks/use-employee-form-modal'
import type { User } from '@/services/users/users.types'
import { ANGOLA_PROVINCES } from '@/constants'
import { useCreateUserMutation, useUpdateUserMutation } from '@/hooks/users'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

export function EmployeeFormModal({ open, onOpenChange, user }: Props) {
  const { mutateAsync: createUser } = useCreateUserMutation()
  const { mutateAsync: updateUser } = useUpdateUserMutation()
  const isEdit = Boolean(user)

  const { form, canSubmit, isLoading } = useEmployeeFormModal({
    user,
    onSave: async (values) => {
      const data = {
        name: values.name,
        bi: values.bi,
        nif: values.nif,
        phone: values.phone,
        alternativePhone: values.alternativePhone ?? '',
        province: values.province,
        municipality: values.municipality,
        address: values.address,
        email: values.email,
        status: values.status,
      }

      if (isEdit && user) {
        await updateUser({ id: user.id.toString(), data })
      } else {
        await createUser(data)
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
            {isEdit ? 'Editar Utilizador' : 'Novo Utilizador'}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? 'Atualize os dados do utilizador.'
              : 'Preencha os dados para registar um novo utilizador.'}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"

          onSubmit={(e) => {
            e.preventDefault()

            form.handleSubmit()
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <form.AppField name="name">
              {(field) => <field.TextField label="Nome Completo" />}
            </form.AppField>

            <form.AppField name="bi">
              {(field) => <field.TextField label="BI" />}
            </form.AppField>

            <form.AppField name="nif">
              {(field) => <field.TextField label="NIF" />}
            </form.AppField>

            <form.AppField name="phone">
              {(field) => <field.TextField label="Telefone" />}
            </form.AppField>
          </div>

          {/* Morada */}

          <div className="grid gap-4 md:grid-cols-2">
            <form.AppField name="province">
              {(field) => (
                <field.ComboboxField
                  label="Província"

                  options={ANGOLA_PROVINCES.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                />
              )}
            </form.AppField>

            <form.AppField name="municipality">
              {(field) => <field.TextField label="Município" />}
            </form.AppField>

            <form.AppField name="address">
              {(field) => <field.TextField label="Morada" />}
            </form.AppField>

            <form.AppField name="email">
              {(field) => <field.TextField label="Email" type="email" />}
            </form.AppField>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>

            <Button type="submit" disabled={!canSubmit || isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Save />}

              {isEdit ? 'Guardar alterações' : 'Criar utilizador'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
