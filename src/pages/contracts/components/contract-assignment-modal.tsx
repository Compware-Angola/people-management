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
import { useAssignContractToEmployeeMutation } from '@/hooks/contracts'
import type {
  Contract,
  ContractType,
} from '@/services/contracts/contracts.types'
import {
  useContractAssignmentModal,
  type ContractAssignmentFormValues,
} from '../hooks/use-contract-assignment-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract?: Contract | null
}

function formatContractType(type: ContractType) {
  const labels: Record<ContractType, string> = {
    CONTRATADO: 'Contratado',
    HORISTA: 'Horista',
    FIXO: 'Fixo',
  }

  return labels[type] ?? type
}

export function ContractAssignmentModal({
  open,
  onOpenChange,
  contract,
}: Props) {
  const { mutateAsync: assignContract } = useAssignContractToEmployeeMutation()
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

  const { form, canSubmit, isLoading } = useContractAssignmentModal({
    open,
    onSave: async (values: ContractAssignmentFormValues) => {
      if (!contract) return

      await assignContract({
        contractId: contract.id,
        employeeId: Number(values.employeeId),
      })

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
          <DialogTitle>Atribuir Contrato</DialogTitle>
          <DialogDescription>
            Selecione o colaborador que deve receber o contrato escolhido.
          </DialogDescription>
        </DialogHeader>

        {contract && (
          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <p className="font-medium">{formatContractType(contract.type)}</p>
            <p className="text-muted-foreground">
              {contract.monthlyHours} horas mensais ·{' '}
              {contract.allowsOvertime === 1
                ? 'permite hora extra'
                : 'não permite hora extra'}
            </p>
          </div>
        )}

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

            <Button
              type="submit"
              disabled={!canSubmit || isLoading || !contract}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
              Atribuir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
