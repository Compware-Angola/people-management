import { useMemo, useState } from 'react'
import {
  Calculator,
  CheckCircle2,
  Eye,
  Plus,
  RefreshCcw,
  RotateCcw,
  XCircle,
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
import { TableEmptyState, TableErrorState } from '@/components/table/table-state'
import { TableGroupRowSkeleton } from '@/components/table/table-skeleton'
import { useAuth } from '@/hooks/auth'
import {
  useReprocessSalaryMutation,
  useSalaryProcessingDetailsQuery,
  useSalaryProcessingQuery,
  useValidateSalaryProcessingMutation,
} from '@/hooks/salary-processing'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { formatDatePtAO } from '@/lib/date/format-date-pt-ao'
import { cn } from '@/lib/utils'
import type {
  SalaryProcessing,
  SalaryProcessingStatus,
} from '@/services/salary-processing/salary-processing.types'
import {
  SalaryProcessingActionDialog,
  type SalaryProcessingAction,
} from './components/salary-processing-action-dialog'
import { SalaryProcessingDetailsModal } from './components/salary-processing-details-modal'
import { SalaryProcessingFormModal } from './components/salary-processing-form-modal'
import { SalaryProcessingStatusBadge } from './components/salary-processing-status-badge'

const statusOptions: { label: string; value: SalaryProcessingStatus }[] = [
  { label: 'Pendente', value: 'PENDENTE' },
  { label: 'Simulado', value: 'SIMULADO' },
  { label: 'Fechado', value: 'FECHADO' },
  { label: 'Recusado', value: 'RECUSADO' },
  { label: 'Cancelado', value: 'CANCELADO' },
]

function emptyValue(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '-'

  return value
}

function canValidate(processing: SalaryProcessing) {
  return ['PENDENTE', 'SIMULADO'].includes(processing.status)
}

function canReprocess(processing: SalaryProcessing) {
  return ['RECUSADO', 'CANCELADO'].includes(processing.status)
}

export function ListSalaryProcessing() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [id, setId] = useState('')
  const [status, setStatus] = useState('all')
  const [responsibleEmployeeId, setResponsibleEmployeeId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [detailsProcessing, setDetailsProcessing] =
    useState<SalaryProcessing | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [actionProcessing, setActionProcessing] =
    useState<SalaryProcessing | null>(null)
  const [currentAction, setCurrentAction] =
    useState<SalaryProcessingAction | null>(null)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const { can } = useAuth()
  const canWriteSalaryProcessing = can(
    PermissionsEnum.WRITE_SALARY_PROCESSING,
  )

  const params = {
    page,
    limit,
    ...(id ? { id: Number(id) } : {}),
    ...(status !== 'all' ? { status: status as SalaryProcessingStatus } : {}),
    ...(responsibleEmployeeId
      ? { responsibleEmployeeId: Number(responsibleEmployeeId) }
      : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  }

  const { data, isLoading, isError, refetch, isFetching } =
    useSalaryProcessingQuery(params)
  const { data: processingDetails, isLoading: isLoadingDetails, isError: isDetailsError } =
    useSalaryProcessingDetailsQuery(detailsProcessing?.id)
  const { mutateAsync: validateProcessing, isPending: isValidating } =
    useValidateSalaryProcessingMutation()
  const { mutateAsync: reprocessSalary, isPending: isReprocessing } =
    useReprocessSalaryMutation()

  const processingRecords = useMemo(() => data?.data ?? [], [data])
  const meta = data?.meta
  const total = meta?.total ?? 0
  const totalPages = meta?.totalPages ?? 1
  const currentPage = meta?.page ?? page
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const rangeEnd = Math.min(currentPage * limit, total)
  const loading = isLoading || isFetching
  const actionLoading = isValidating || isReprocessing

  function resetPage() {
    setPage(1)
  }

  function openDetailsModal(processing: SalaryProcessing) {
    setDetailsProcessing(processing)
    setIsDetailsModalOpen(true)
  }

  function openActionDialog(
    action: SalaryProcessingAction,
    processing: SalaryProcessing,
  ) {
    setCurrentAction(action)
    setActionProcessing(processing)
    setIsActionDialogOpen(true)
  }

  async function handleConfirmAction() {
    if (!actionProcessing || !currentAction) return

    if (currentAction === 'close') {
      await validateProcessing({
        id: actionProcessing.id,
        data: { status: 'FECHADO' },
      })
    }

    if (currentAction === 'reject') {
      await validateProcessing({
        id: actionProcessing.id,
        data: { status: 'RECUSADO' },
      })
    }

    if (currentAction === 'reprocess') {
      await reprocessSalary(actionProcessing.id)
    }

    setIsActionDialogOpen(false)
    setActionProcessing(null)
    setCurrentAction(null)
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
                <BreadcrumbPage>Processamentos Salariais</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">
            Processamentos Salariais
          </h1>
          <p className="text-muted-foreground">
            Consultar, processar e validar salários dos colaboradores
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

          {canWriteSalaryProcessing && (
            <Button onClick={() => setIsFormModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Processamento
            </Button>
          )}
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
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
              placeholder="Código"
            />
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value)
                resetPage()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Responsável</Label>
            <Input
              value={responsibleEmployeeId}
              type="number"
              min="1"
              onChange={(event) => {
                setResponsibleEmployeeId(event.target.value)
                resetPage()
              }}
              placeholder="Código do colaborador"
            />
          </div>

          <div className="space-y-2">
            <Label>Data de início</Label>
            <Input
              value={startDate}
              type="date"
              onChange={(event) => {
                setStartDate(event.target.value)
                resetPage()
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Data de fim</Label>
            <Input
              value={endDate}
              type="date"
              onChange={(event) => {
                setEndDate(event.target.value)
                resetPage()
              }}
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
                <TableHead>Período</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Validador</TableHead>
                <TableHead>Validado em</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableGroupRowSkeleton rows={10} columns={8} />
              ) : isError ? (
                <TableErrorState
                  columns={8}
                  icon={Calculator}
                  title="Erro ao carregar processamentos salariais"
                />
              ) : processingRecords.length === 0 ? (
                <TableEmptyState
                  columns={8}
                  icon={Calculator}
                  title="Nenhum processamento salarial encontrado."
                />
              ) : (
                processingRecords.map((processing) => (
                  <TableRow key={processing.id}>
                    <TableCell>{processing.id}</TableCell>
                    <TableCell>
                      {formatDatePtAO(processing.startDate)} -{' '}
                      {formatDatePtAO(processing.endDate)}
                    </TableCell>
                    <TableCell>
                      <SalaryProcessingStatusBadge
                        status={processing.status}
                      />
                    </TableCell>
                    <TableCell>
                      {emptyValue(processing.responsibleEmployeeName)}
                    </TableCell>
                    <TableCell>
                      {emptyValue(processing.validatorEmployeeName)}
                    </TableCell>
                    <TableCell>
                      {processing.validatedAt
                        ? formatDatePtAO(processing.validatedAt)
                        : '-'}
                    </TableCell>
                    <TableCell>{formatDatePtAO(processing.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDetailsModal(processing)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver detalhes</TooltipContent>
                        </Tooltip>

                        {canWriteSalaryProcessing && canValidate(processing) ? (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    openActionDialog('close', processing)
                                  }
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Fechar processamento</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    openActionDialog('reject', processing)
                                  }
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Recusar processamento</TooltipContent>
                            </Tooltip>
                          </>
                        ) : null}

                        {canWriteSalaryProcessing && canReprocess(processing) ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  openActionDialog('reprocess', processing)
                                }
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reprocessar</TooltipContent>
                          </Tooltip>
                        ) : null}
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

      <SalaryProcessingFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
      />

      <SalaryProcessingDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        processing={processingDetails}
        loading={isLoadingDetails}
        error={isDetailsError}
      />

      <SalaryProcessingActionDialog
        open={isActionDialogOpen}
        onOpenChange={setIsActionDialogOpen}
        processing={actionProcessing}
        action={currentAction}
        loading={actionLoading}
        onConfirm={handleConfirmAction}
      />
    </div>
  )
}
