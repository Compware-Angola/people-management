import { useMemo, useState } from 'react'
import {
  BadgeDollarSign,
  Pencil,
  Plus,
  ReceiptText,
  RefreshCcw,
  UserPlus,
} from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Pagination } from '@/components/table/pagination'
import { TableEmptyState, TableErrorState } from '@/components/table/table-state'
import { TableGroupRowSkeleton } from '@/components/table/table-skeleton'
import { useAuth } from '@/hooks/auth'
import { useSalariesQuery } from '@/hooks/salaries'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { formatDatePtAO } from '@/lib/date/format-date-pt-ao'
import { cn } from '@/lib/utils'
import type { Salary } from '@/services/salaries/salaries.types'
import { SalaryAssignmentFormModal } from './components/salary-assignment-form-modal'
import { SalaryFormModal } from './components/salary-form-modal'
import { SalaryRubricsModal } from './components/salary-rubrics-modal'
import { SalaryStatusBadge } from './components/salary-status-badge'
import { RubricFormModal } from './components/rubric-form-modal'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0))
}

export function ListSalaries() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [id, setId] = useState('')
  const [position, setPosition] = useState('')
  const [category, setCategory] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false)
  const [isRubricModalOpen, setIsRubricModalOpen] = useState(false)
  const [isSalaryRubricsModalOpen, setIsSalaryRubricsModalOpen] =
    useState(false)
  const [editingSalary, setEditingSalary] = useState<Salary | null>(null)
  const [assigningSalary, setAssigningSalary] = useState<Salary | null>(null)
  const [selectedSalaryForRubrics, setSelectedSalaryForRubrics] =
    useState<Salary | null>(null)
  const { can } = useAuth()
  const canWriteSalaries = can(PermissionsEnum.WRITE_SALARIES)

  const { data, isLoading, isError, refetch, isFetching } = useSalariesQuery({
    page,
    limit,
    ...(id ? { id: Number(id) } : {}),
    ...(position ? { position } : {}),
    ...(category ? { category } : {}),
  })

  const salaryRecords = useMemo(() => data?.data ?? [], [data])
  const meta = data?.meta
  const total = meta?.total ?? 0
  const totalPages = meta?.totalPages ?? 1
  const currentPage = meta?.page ?? page
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const rangeEnd = Math.min(currentPage * limit, total)
  const loading = isLoading || isFetching

  function resetPage() {
    setPage(1)
  }

  function openCreateModal() {
    setEditingSalary(null)
    setIsModalOpen(true)
  }

  function openEditModal(salary: Salary) {
    setEditingSalary(salary)
    setIsModalOpen(true)
  }

  function openAssignmentModal(salary: Salary) {
    setAssigningSalary(salary)
    setIsAssignmentModalOpen(true)
  }

  function openSalaryRubricsModal(salary: Salary) {
    setSelectedSalaryForRubrics(salary)
    setIsSalaryRubricsModalOpen(true)
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Estruturas Salariais</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">
            Estruturas Salariais
          </h1>
          <p className="text-muted-foreground">
            Consultar e gerir estruturas salariais usadas nos colaboradores
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCcw
              className={cn(
                'mr-2 h-4 w-4',
                !isLoading && isFetching && 'animate-spin',
              )}
            />
            Atualizar
          </Button>

          {canWriteSalaries && (
            <>
              <Button onClick={openCreateModal}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Estrutura
              </Button>

              <Button onClick={() => setIsRubricModalOpen(true)}>
                <ReceiptText className="mr-2 h-4 w-4" />
                Nova Rubrica
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Código</Label>
            <Input
              value={id}
              type="number"
              min="1"
              onChange={(event) => {
                setId(event.target.value)
                resetPage()
              }}
              placeholder="Pesquisar por código"
            />
          </div>

          <div className="space-y-2">
            <Label>Cargo</Label>
            <Input
              value={position}
              onChange={(event) => {
                setPosition(event.target.value)
                resetPage()
              }}
              placeholder="Pesquisar por cargo"
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Input
              value={category}
              onChange={(event) => {
                setCategory(event.target.value)
                resetPage()
              }}
              placeholder="Pesquisar por categoria"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Salário base</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableGroupRowSkeleton rows={10} columns={7} />
              ) : isError ? (
                <TableErrorState
                  columns={7}
                  icon={BadgeDollarSign}
                  title="Erro ao carregar estruturas salariais"
                />
              ) : salaryRecords.length === 0 ? (
                <TableEmptyState
                  columns={7}
                  icon={BadgeDollarSign}
                  title="Nenhuma estrutura salarial encontrada."
                />
              ) : (
                salaryRecords.map((salary) => (
                  <TableRow key={salary.id}>
                    <TableCell>{salary.id}</TableCell>
                    <TableCell className="font-medium">
                      {salary.position}
                    </TableCell>
                    <TableCell>{salary.category}</TableCell>
                    <TableCell>{formatCurrency(salary.baseSalary)}</TableCell>
                    <TableCell>
                      <SalaryStatusBadge status={salary.status} />
                    </TableCell>
                    <TableCell>{formatDatePtAO(salary.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {canWriteSalaries && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openAssignmentModal(salary)}
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Atribuir a colaborador
                            </TooltipContent>
                          </Tooltip>
                        )}

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openSalaryRubricsModal(salary)}
                            >
                              <ReceiptText className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver/associar rubricas</TooltipContent>
                        </Tooltip>

                        {canWriteSalaries && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditModal(salary)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Editar estrutura salarial
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          total={total}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          limit={limit}
          loading={isLoading}
          onPageChange={setPage}
          onLimitChange={(value) => {
            setLimit(value)
            setPage(1)
          }}
        />
      </Card>

      <SalaryFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        salary={editingSalary}
      />

      <SalaryAssignmentFormModal
        open={isAssignmentModalOpen}
        onOpenChange={setIsAssignmentModalOpen}
        salary={assigningSalary}
      />

      <RubricFormModal
        open={isRubricModalOpen}
        onOpenChange={setIsRubricModalOpen}
      />

      <SalaryRubricsModal
        open={isSalaryRubricsModalOpen}
        onOpenChange={setIsSalaryRubricsModalOpen}
        salary={selectedSalaryForRubrics}
        canAssociate={canWriteSalaries}
      />
    </div>
  )
}
