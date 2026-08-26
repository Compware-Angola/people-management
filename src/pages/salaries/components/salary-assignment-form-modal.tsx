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
import { useEmployeesQuery } from '@/hooks/employees'
import { useAssignSalaryToEmployeeMutation } from '@/hooks/salaries'
import type { Salary } from '@/services/salaries/salaries.types'
import {
  useSalaryAssignmentFormModal,
  type SalaryAssignmentFormValues,
} from '../hooks/use-salary-assignment-form-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  salary?: Salary | null
}

function buildPayload(salary: Salary, values: SalaryAssignmentFormValues) {
  return {
    salaryId: salary.id,
    employeeId: Number(values.employeeId),
  }
}

export function SalaryAssignmentFormModal({
  open,
  onOpenChange,
  salary,
}: Props) {
  const { mutateAsync: assignSalaryToEmployee } =
    useAssignSalaryToEmployeeMutation()
  const { data: employeesData, isLoading: isLoadingEmployees } =
    useEmployeesQuery({
      page: 1,
      limit: 100,
    })

  const employeeOptions =
    employeesData?.data.map((employee) => ({
      label: employee.name,
      value: String(employee.id),
    })) ?? []

  const { form, canSubmit, isLoading } = useSalaryAssignmentFormModal({
    open,
    salary,
    onSave: async (values) => {
      if (!salary) return

      await assignSalaryToEmployee(buildPayload(salary, values))
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
          <DialogTitle>Atribuir Estrutura Salarial</DialogTitle>
          <DialogDescription>
            Selecione o colaborador que deve receber a estrutura salarial{' '}
            {salary ? `${salary.position} - ${salary.category}` : ''}.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.AppField name="employeeId">
            {(field) => (
              <field.ComboboxField
                label="Colaborador"
                placeholder={
                  isLoadingEmployees
                    ? 'Carregando colaboradores...'
                    : 'Selecionar colaborador'
                }
                emptyMessage="Nenhum colaborador encontrado."
                options={employeeOptions}
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

            <Button type="submit" disabled={!canSubmit || isLoading || !salary}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
              Atribuir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
