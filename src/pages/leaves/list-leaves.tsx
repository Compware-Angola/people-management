import { useMemo, useState } from 'react'
import { ClipboardCheck, Pencil, Plus, RefreshCcw, X } from 'lucide-react'

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Pagination } from '@/components/table/pagination'
import { TableGroupRowSkeleton } from '@/components/table/table-skeleton'
import { useEmployeesQuery } from '@/hooks/employees'
import { useLeavesQuery } from '@/hooks/leaves'
import { cn } from '@/lib/utils'
import type {
  Leave,
  LeaveStatus,
  LeaveType,
} from '@/services/leaves/leaves.types'
import { LeaveFormModal } from './components/leave-form-modal'
import { LeaveStatusBadge } from './components/leave-status-badge'
import { LeaveStatusModal } from './components/leave-status-modal'

const leaveTypeLabels: Record<LeaveType, string> = {
  MEDICA: 'Médica',
  MATERNIDADE: 'Maternidade',
  PATERNIDADE: 'Paternidade',
  ESTUDO: 'Estudo',
}

const statusLabels: Record<LeaveStatus, string> = {
  PENDENTE: 'Pendente',
  APROVADA: 'Aprovada',
  REJEITADA: 'Rejeitada',
  CANCELADA: 'Cancelada',
}

function formatDate(value?: string | null) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function emptyValue(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '-'

  return value
}

export function ListLeaves() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [selectedType, setSelectedType] = useState<LeaveType | 'ALL'>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<LeaveStatus | 'ALL'>(
    'ALL',
  )
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null)

  const { data: employeesData } = useEmployeesQuery({
    page: 1,
    limit: 100,
  })

  const { data, isLoading, isError, refetch, isFetching } = useLeavesQuery({
    page,
    limit,
    ...(selectedType !== 'ALL' ? { type: selectedType } : {}),
    ...(selectedStatus !== 'ALL' ? { status: selectedStatus } : {}),
  })

  const leaves = useMemo(() => data?.data ?? [], [data])
  const employeeNameById = useMemo(() => {
    return new Map(
      (employeesData?.data ?? []).map((employee) => [
        employee.id,
        employee.name,
      ]),
    )
  }, [employeesData])

  const meta = data?.meta
  const total = meta?.total ?? 0
  const totalPages = meta?.totalPages ?? 1
  const currentPage = meta?.page ?? page
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const rangeEnd = Math.min(currentPage * limit, total)
  const loading = isLoading || isFetching

  function openStatusModal(leave: Leave) {
    setSelectedLeave(leave)
    setIsStatusModalOpen(true)
  }

  function clearFilters() {
    setSelectedType('ALL')
    setSelectedStatus('ALL')
    setPage(1)
  }

  function getEmployeeName(employeeId: number) {
    return employeeNameById.get(employeeId) ?? `Colaborador #${employeeId}`
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
                <BreadcrumbPage>Licenças</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">Licenças</h1>
          <p className="text-muted-foreground">
            Consultar e registrar licenças de colaboradores
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

          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Licença
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-[minmax(180px,220px)_minmax(180px,220px)_auto] md:items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de licença</label>
            <Select
              value={selectedType}
              onValueChange={(value) => {
                setSelectedType(value as LeaveType | 'ALL')
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                {Object.entries(leaveTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <Select
              value={selectedStatus}
              onValueChange={(value) => {
                setSelectedStatus(value as LeaveStatus | 'ALL')
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Aprovador</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableGroupRowSkeleton rows={10} columns={10} />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <ClipboardCheck className="h-8 w-8 text-destructive" />
                      <span className="font-medium text-destructive">
                        Erro ao carregar licenças
                      </span>
                      <span className="text-sm">
                        Não foi possível buscar os dados. Tente novamente mais
                        tarde.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : leaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ClipboardCheck className="h-8 w-8" />
                      <span>Nenhum registro de licença encontrado.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                leaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.id}</TableCell>
                    <TableCell className="font-medium">
                      {getEmployeeName(leave.employeeId)}
                    </TableCell>
                    <TableCell>{leaveTypeLabels[leave.type]}</TableCell>
                    <TableCell>{formatDate(leave.startDate)}</TableCell>
                    <TableCell>{formatDate(leave.endDate)}</TableCell>
                    <TableCell>
                      <LeaveStatusBadge status={leave.status} />
                    </TableCell>
                    <TableCell>{emptyValue(leave.documentId)}</TableCell>
                    <TableCell>{emptyValue(leave.approverId)}</TableCell>
                    <TableCell>{formatDate(leave.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openStatusModal(leave)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Atualizar estado</TooltipContent>
                      </Tooltip>
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

      <LeaveFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <LeaveStatusModal
        open={isStatusModalOpen}
        onOpenChange={(open) => {
          setIsStatusModalOpen(open)

          if (!open) {
            setSelectedLeave(null)
          }
        }}
        leave={selectedLeave}
      />
    </div>
  )
}
