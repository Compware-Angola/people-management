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
import { formatDatePtAO } from '@/lib/date/format-date-pt-ao'
import type { SalaryProcessingDetails } from '@/services/salary-processing/salary-processing.types'
import { Calculator, UserRound, X } from 'lucide-react'
import { SalaryProcessingStatusBadge } from './salary-processing-status-badge'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  processing?: SalaryProcessingDetails | null
  loading?: boolean
  error?: boolean
}

function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0))
}

function emptyValue(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '-'

  return value
}

function employeeDisplayName(employee: {
  employeeId: number
  employeeName?: string | null
}) {
  return employee.employeeName || `#${employee.employeeId}`
}

export function SalaryProcessingDetailsModal({
  open,
  onOpenChange,
  processing,
  loading,
  error,
}: Props) {
  const employees = processing?.employees ?? []
  const skippedEmployees = processing?.skippedEmployees ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Processamento Salarial</DialogTitle>
          <DialogDescription>
            {processing
              ? `Processamento #${processing.id}`
              : 'Resumo do processamento selecionado'}
          </DialogDescription>
        </DialogHeader>

        {processing ? (
          <div className="grid gap-3 md:grid-cols-5">
            <Card className="p-3">
              <p className="text-sm text-muted-foreground">Estado</p>
              <SalaryProcessingStatusBadge status={processing.status} />
            </Card>
            <Card className="p-3">
              <p className="text-sm text-muted-foreground">Início</p>
              <p className="font-medium">{formatDatePtAO(processing.startDate)}</p>
            </Card>
            <Card className="p-3">
              <p className="text-sm text-muted-foreground">Fim</p>
              <p className="font-medium">{formatDatePtAO(processing.endDate)}</p>
            </Card>
            <Card className="p-3">
              <p className="text-sm text-muted-foreground">Responsável</p>
              <p className="font-medium">
                {emptyValue(processing.responsibleEmployeeName)}
              </p>
            </Card>
            <Card className="p-3">
              <p className="text-sm text-muted-foreground">Validador</p>
              <p className="font-medium">
                {emptyValue(processing.validatorEmployeeName)}
              </p>
            </Card>
          </div>
        ) : null}

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Salário</TableHead>
                  <TableHead>Horas</TableHead>
                  <TableHead>Horas extra</TableHead>
                  <TableHead>Bruto</TableHead>
                  <TableHead>Descontos</TableHead>
                  <TableHead>Líquido</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableGroupRowSkeleton rows={5} columns={7} />
                ) : error ? (
                  <TableErrorState
                    columns={7}
                    icon={Calculator}
                    title="Erro ao carregar detalhes"
                  />
                ) : employees.length === 0 ? (
                  <TableEmptyState
                    columns={7}
                    icon={UserRound}
                    title="Nenhum colaborador processado."
                  />
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.employeeId}>
                      <TableCell>{employeeDisplayName(employee)}</TableCell>
                      <TableCell>
                        {formatCurrency(employee.salaryValue)}
                      </TableCell>
                      <TableCell>{emptyValue(employee.workedHours)}</TableCell>
                      <TableCell>{emptyValue(employee.overtimeHours)}</TableCell>
                      <TableCell>{formatCurrency(employee.grossTotal)}</TableCell>
                      <TableCell>
                        {formatCurrency(employee.discountTotal)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(employee.netTotal)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {skippedEmployees.length > 0 ? (
          <Card className="p-4">
            <h3 className="mb-3 font-semibold">Colaboradores ignorados</h3>
            <div className="space-y-2">
              {skippedEmployees.map((employee) => (
                <div
                  key={`${employee.employeeId}-${employee.reason}`}
                  className="rounded-md border p-3 text-sm"
                >
                  <span className="font-medium">
                    {employeeDisplayName(employee)}
                  </span>
                  <span className="text-muted-foreground">
                    {' '}
                    - {employee.reason}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            <X className="mr-2 h-4 w-4" />
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
