import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableEmptyState, TableErrorState } from '@/components/table/table-state'
import { TableGroupRowSkeleton } from '@/components/table/table-skeleton'
import {
  useAssociateRubricToStructureMutation,
  useRubricsQuery,
  useSalaryStructureRubricsQuery,
} from '@/hooks/salaries'
import type { Salary } from '@/services/salaries/salaries.types'
import { BadgeDollarSign, Loader2, Plus, ReceiptText, X } from 'lucide-react'
import {
  useSalaryRubricAssociationFormModal,
  type SalaryRubricAssociationFormValues,
} from '../hooks/use-salary-rubric-association-form-modal'
import { SalaryStatusBadge } from './salary-status-badge'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  salary?: Salary | null
}

function formatRubricValue(value: number, valueType: string) {
  if (valueType === 'PERCENTUAL') {
    return `${Number(value ?? 0).toLocaleString('pt-AO')}%`
  }

  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0))
}

function buildPayload(
  salary: Salary,
  values: SalaryRubricAssociationFormValues,
) {
  return {
    salaryStructureCode: salary.id,
    rubricCode: Number(values.rubricCode),
  }
}

export function SalaryRubricsModal({ open, onOpenChange, salary }: Props) {
  const salaryId = salary?.id
  const { data, isLoading, isError, isFetching } =
    useSalaryStructureRubricsQuery(open ? salaryId : undefined)
  const { mutateAsync: associateRubric } =
    useAssociateRubricToStructureMutation()
  const { data: availableRubricsData, isLoading: isLoadingAvailableRubrics } =
    useRubricsQuery(open ? { status: 1, limit: 100 } : undefined)

  const rubrics = data?.rubrics ?? []
  const availableRubrics = availableRubricsData?.data ?? []
  const rubricOptions = availableRubrics.map((rubric) => ({
    value: String(rubric.code),
    label: `${rubric.code} - ${rubric.description} (${rubric.type} / ${rubric.valueType})`,
  }))
  const loading = isLoading || isFetching

  const { form, canSubmit, isLoading: isSubmitting } =
    useSalaryRubricAssociationFormModal({
      open,
      salary,
      onSave: async (values) => {
        if (!salary) return

        await associateRubric(buildPayload(salary, values))
        form.reset()
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
      <DialogContent className="max-h-[90vh] max-w-4xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rubricas da Estrutura Salarial</DialogTitle>
          <DialogDescription>
            {salary
              ? `${salary.position} - ${salary.category}`
              : 'Estrutura salarial selecionada'}
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-3 md:grid-cols-[1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.AppField name="rubricCode">
            {(field) => (
              <field.ComboboxField
                label="Rubrica"
                placeholder={
                  isLoadingAvailableRubrics
                    ? 'Carregando rubricas...'
                    : 'Selecione a rubrica'
                }
                emptyMessage="Nenhuma rubrica ativa encontrada."
                options={rubricOptions}
              />
            )}
          </form.AppField>

          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={!canSubmit || isSubmitting || !salary}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Associar
            </Button>
          </div>
        </form>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Tipo de valor</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableGroupRowSkeleton rows={5} columns={6} />
                ) : isError ? (
                  <TableErrorState
                    columns={6}
                    icon={BadgeDollarSign}
                    title="Erro ao carregar rubricas"
                  />
                ) : rubrics.length === 0 ? (
                  <TableEmptyState
                    columns={6}
                    icon={ReceiptText}
                    title="Nenhuma rubrica associada."
                  />
                ) : (
                  rubrics.map((rubric) => (
                    <TableRow key={rubric.code}>
                      <TableCell>{rubric.code}</TableCell>
                      <TableCell className="font-medium">
                        {rubric.description}
                      </TableCell>
                      <TableCell>{rubric.type}</TableCell>
                      <TableCell>{rubric.valueType}</TableCell>
                      <TableCell>
                        {formatRubricValue(rubric.value, rubric.valueType)}
                      </TableCell>
                      <TableCell>
                        <SalaryStatusBadge status={rubric.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            <X className="mr-2 h-4 w-4" />
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
