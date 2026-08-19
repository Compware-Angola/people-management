import { useMemo, useState } from 'react'
import { BadgeDollarSign, Loader2, Search } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { useEmployeesQuery } from '@/hooks/employees'
import {
  useEmployeeSalaryHistoryQuery,
  useEmployeeSalaryQuery,
} from '@/hooks/salaries'
import { formatDatePtAO } from '@/lib/date/format-date-pt-ao'
import { SalaryStatusBadge } from '@/pages/salaries/components/salary-status-badge'

function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0))
}

export function ListEmployeeSalaries() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const employeeId = selectedEmployeeId ? Number(selectedEmployeeId) : undefined

  const { data: employeesData, isLoading: isLoadingEmployees } =
    useEmployeesQuery({
      page: 1,
      limit: 100,
    })
  const {
    data: currentSalary,
    isLoading: isLoadingCurrentSalary,
    isError: isCurrentSalaryError,
    isFetching: isFetchingCurrentSalary,
  } = useEmployeeSalaryQuery(employeeId)
  const {
    data: history = [],
    isLoading: isLoadingHistory,
    isError: isHistoryError,
    isFetching: isFetchingHistory,
  } = useEmployeeSalaryHistoryQuery(employeeId)

  const selectedEmployee = useMemo(
    () =>
      employeesData?.data.find(
        (employee) => String(employee.id) === selectedEmployeeId,
      ),
    [employeesData, selectedEmployeeId],
  )
  const loadingCurrentSalary = isLoadingCurrentSalary || isFetchingCurrentSalary
  const loadingHistory = isLoadingHistory || isFetchingHistory

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Salários dos Colaboradores</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold tracking-tight">
          Salários dos Colaboradores
        </h1>
        <p className="text-muted-foreground">
          Consulte a estrutura salarial atual e o histórico salarial de cada
          colaborador
        </p>
      </div>

      <Card className="p-4">
        <div className="max-w-xl space-y-2">
          <Label>Colaborador</Label>
          <Select
            value={selectedEmployeeId}
            onValueChange={setSelectedEmployeeId}
            disabled={isLoadingEmployees}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  isLoadingEmployees
                    ? 'Carregando colaboradores...'
                    : 'Selecionar colaborador'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {employeesData?.data.map((employee) => (
                <SelectItem key={employee.id} value={String(employee.id)}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {!employeeId ? (
        <Card className="p-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            Selecione um colaborador para consultar os dados salariais.
          </div>
        </Card>
      ) : (
        <>
          <Card className="p-4">
            <div className="mb-3">
              <h3 className="font-semibold">Estrutura atual</h3>
              <p className="text-sm text-muted-foreground">
                {selectedEmployee?.name ?? `Colaborador #${employeeId}`}
              </p>
            </div>

            {loadingCurrentSalary ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando estrutura atual...
              </div>
            ) : isCurrentSalaryError ? (
              <div className="text-sm text-muted-foreground">
                Nenhuma estrutura salarial ativa encontrada para este
                colaborador.
              </div>
            ) : currentSalary?.salaryStructure ? (
              <div className="grid gap-3 md:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Código</p>
                  <p className="font-medium">
                    {currentSalary.salaryStructure.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cargo</p>
                  <p className="font-medium">
                    {currentSalary.salaryStructure.position}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Categoria</p>
                  <p className="font-medium">
                    {currentSalary.salaryStructure.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Salário base</p>
                  <p className="font-medium">
                    {formatCurrency(currentSalary.salaryStructure.baseSalary)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Nenhuma estrutura salarial ativa encontrada para este
                colaborador.
              </div>
            )}
          </Card>

          <Card>
            <div className="border-b p-4">
              <h3 className="font-semibold">Histórico salarial</h3>
              <p className="text-sm text-muted-foreground">
                Estruturas já atribuídas ao colaborador.
              </p>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estrutura</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Salário base</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Fim</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loadingHistory ? (
                    <TableGroupRowSkeleton rows={5} columns={7} />
                  ) : isHistoryError ? (
                    <TableErrorState
                      columns={7}
                      icon={BadgeDollarSign}
                      title="Erro ao carregar histórico salarial"
                    />
                  ) : history.length === 0 ? (
                    <TableEmptyState
                      columns={7}
                      icon={BadgeDollarSign}
                      title="Nenhum histórico salarial encontrado."
                    />
                  ) : (
                    history.map((item, index) => (
                      <TableRow
                        key={`${item.salaryId}-${item.employeeId}-${item.startDate}-${index}`}
                      >
                        <TableCell>{item.salaryId}</TableCell>
                        <TableCell className="font-medium">
                          {item.salaryStructure?.position ?? '-'}
                        </TableCell>
                        <TableCell>
                          {item.salaryStructure?.category ?? '-'}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.salaryStructure?.baseSalary)}
                        </TableCell>
                        <TableCell>
                          <SalaryStatusBadge
                            status={item.status === 'ATIVA' ? 1 : 0}
                          />
                        </TableCell>
                        <TableCell>{formatDatePtAO(item.startDate)}</TableCell>
                        <TableCell>
                          {item.endDate ? formatDatePtAO(item.endDate) : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
