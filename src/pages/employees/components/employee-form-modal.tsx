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
import type { Employee } from '@/services/employees/employees.types'
import { ANGOLA_PROVINCES, BANKS, CURRENCY } from '@/constants'
import { useCreateEmployeeMutation, useUpdateEmployeeMutation } from '@/hooks/employees'



type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee?: Employee | null

  
}

export function EmployeeFormModal({ open, onOpenChange, employee }: Props) {
  const {mutateAsync: createEmployee} = useCreateEmployeeMutation()
  const { mutateAsync: updateEmployee } = useUpdateEmployeeMutation()
  const isEdit = Boolean(employee)

  const { form, canSubmit, isLoading } = useEmployeeFormModal({
    employee,
    onSave: async (values) => {
      const data = {
        ...values,
        alternativePhone: values.alternativePhone ?? '',
      }

      if (isEdit && employee) {
        await updateEmployee({ id: employee.id.toString(), data })
      } else {
        await createEmployee(data)
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
      <DialogContent
        className="max-h-[90vh] max-w-2xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Colaborador' : 'Novo Colaborador'}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? 'Atualize os dados do colaborador.'
              : 'Preencha os dados para registar um novo colaborador.'}
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

          {/* Bancos */}

          <div className="grid gap-4 md:grid-cols-2">
            <form.AppField name="bank">
              {(field) => (
                <field.ComboboxField
                  label="Banco"

                  options={BANKS.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                />
              )}
            </form.AppField>

            <form.AppField name="currency">
              {(field) => (
                <field.SelectField
                  label="Moeda"
                  options={CURRENCY.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                />
              )}
            </form.AppField>
            <form.AppField name="iban">
              {(field) => <field.TextField label="IBAN" />}
            </form.AppField>
            <form.AppField name="accountHolder">
              {(field) => <field.TextField label="Titular da Conta" />}
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

              {isEdit ? 'Guardar alterações' : 'Criar colaborador'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
