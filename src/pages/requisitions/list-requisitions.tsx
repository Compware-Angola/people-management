import { useMemo, useState } from 'react'
import {
  BadgeDollarSign,
  Eye,
  FileText,
  Pencil,
  Plus,
  RefreshCcw,
  Send,
  Trash2,
  UserCheck,
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
import { TableGroupRowSkeleton } from '@/components/table/table-skeleton'
import { useCostCentersQuery } from '@/hooks/cost-centers'
import { useDepartmentsQuery } from '@/hooks/departments'
import { useHiringTypesQuery } from '@/hooks/hiring-types'
import { usePositionsQuery } from '@/hooks/positions'
import { useRequisitionStatesQuery } from '@/hooks/requisition-states'
import { useVacancyRequestTypesQuery } from '@/hooks/vacancy-request-types'
import { useAuth } from '@/hooks/auth'
import { PermissionsEnum } from '@/enums/permissions.enum'
import {
  useAnalyzeRequisitionFinancialMutation,
  useAnalyzeRequisitionRhMutation,
  useCancelRequisitionMutation,
  useRemoveRequisitionMutation,
  useRequisitionDetailsQuery,
  useRequisitionsQuery,
  useSendRequisitionMutation,
} from '@/hooks/requisitions'
import { cn } from '@/lib/utils'
import type {
  AnalyzeRequisitionFinancialDTO,
  AnalyzeRequisitionRhDTO,
  CancelRequisitionDTO,
  Requisition,
} from '@/services/requisitions/requisitions.types'
import {
  RequisitionActionDialog,
  type RequisitionAction,
} from './components/requisition-action-dialog'
import { RequisitionDeleteDialog } from './components/requisition-delete-dialog'
import { RequisitionDetailsModal } from './components/requisition-details-modal'
import { RequisitionFormModal } from './components/requisition-form-modal'
import { RequisitionStatusBadge } from './components/requisition-status-badge'

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

function isDraft(requisition: Requisition) {
  return requisition.state.acronym === 'RASCUNHO'
}

function canCancel(requisition: Requisition) {
  return ['RASCUNHO', 'AGUARDANDO_RH', 'AGUARDANDO_FINANCEIRO'].includes(
    requisition.state.acronym,
  )
}

export function ListRequisitions() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [requesterName, setRequesterName] = useState('')
  const [departmentId, setDepartmentId] = useState('all')
  const [costCenterId, setCostCenterId] = useState('all')
  const [stateId, setStateId] = useState('all')
  const [positionId, setPositionId] = useState('all')
  const [hiringTypeId, setHiringTypeId] = useState('all')
  const [vacancyRequestTypeId, setVacancyRequestTypeId] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingRequisition, setEditingRequisition] =
    useState<Requisition | null>(null)
  const [detailsRequisition, setDetailsRequisition] =
    useState<Requisition | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [deletingRequisition, setDeletingRequisition] =
    useState<Requisition | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [actionRequisition, setActionRequisition] =
    useState<Requisition | null>(null)
  const [currentAction, setCurrentAction] = useState<RequisitionAction | null>(
    null,
  )
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const { can } = useAuth()
  const canWriteRequisitions = can(PermissionsEnum.WRITE_REQUISITIONS)

  const { mutateAsync: removeRequisition, isPending: isRemoving } =
    useRemoveRequisitionMutation()
  const { mutateAsync: sendRequisition, isPending: isSending } =
    useSendRequisitionMutation()
  const { mutateAsync: cancelRequisition, isPending: isCancelling } =
    useCancelRequisitionMutation()
  const { mutateAsync: analyzeRh, isPending: isAnalyzingRh } =
    useAnalyzeRequisitionRhMutation()
  const { mutateAsync: analyzeFinancial, isPending: isAnalyzingFinancial } =
    useAnalyzeRequisitionFinancialMutation()

  const params = {
    page,
    limit,
    ...(search ? { search } : {}),
    ...(requesterName ? { requesterName } : {}),
    ...(departmentId !== 'all' ? { departmentId: Number(departmentId) } : {}),
    ...(costCenterId !== 'all' ? { costCenterId: Number(costCenterId) } : {}),
    ...(stateId !== 'all' ? { stateId: Number(stateId) } : {}),
    ...(positionId !== 'all' ? { positionId: Number(positionId) } : {}),
    ...(hiringTypeId !== 'all' ? { hiringTypeId: Number(hiringTypeId) } : {}),
    ...(vacancyRequestTypeId !== 'all'
      ? { vacancyRequestTypeId: Number(vacancyRequestTypeId) }
      : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  }

  const { data, isLoading, isError, refetch, isFetching } =
    useRequisitionsQuery(params)
  const { data: statesData } = useRequisitionStatesQuery({
    page: 1,
    limit: 100,
  })
  const { data: departmentsData } = useDepartmentsQuery({
    page: 1,
    limit: 100,
    status: 1,
  })
  const { data: costCentersData } = useCostCentersQuery({
    page: 1,
    limit: 100,
    ...(departmentId !== 'all' ? { departmentId: Number(departmentId) } : {}),
    status: 1,
  })
  const { data: positionsData } = usePositionsQuery({
    page: 1,
    limit: 100,
    status: 1,
  })
  const { data: hiringTypesData } = useHiringTypesQuery({
    page: 1,
    limit: 100,
    status: 1,
  })
  const { data: vacancyRequestTypesData } = useVacancyRequestTypesQuery({
    page: 1,
    limit: 100,
    status: 1,
  })
  const { data: requisitionDetails } = useRequisitionDetailsQuery(
    detailsRequisition?.requisitionCode,
  )

  const requisitionRecords = useMemo(() => data?.data ?? [], [data])
  const meta = data?.meta
  const total = meta?.total ?? 0
  const totalPages = meta?.totalPages ?? 1
  const currentPage = meta?.page ?? page
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const rangeEnd = Math.min(currentPage * limit, total)
  const loading = isLoading || isFetching
  const actionLoading =
    isCancelling || isAnalyzingRh || isAnalyzingFinancial || isSending

  function resetPage() {
    setPage(1)
  }

  function openCreateModal() {
    setEditingRequisition(null)
    setIsFormModalOpen(true)
  }

  function openEditModal(requisition: Requisition) {
    setEditingRequisition(requisition)
    setIsFormModalOpen(true)
  }

  function openDetailsModal(requisition: Requisition) {
    setDetailsRequisition(requisition)
    setIsDetailsModalOpen(true)
  }

  function openDeleteDialog(requisition: Requisition) {
    setDeletingRequisition(requisition)
    setIsDeleteDialogOpen(true)
  }

  function openActionDialog(
    action: RequisitionAction,
    requisition: Requisition,
  ) {
    setCurrentAction(action)
    setActionRequisition(requisition)
    setIsActionDialogOpen(true)
  }

  async function handleConfirmRemove() {
    if (!deletingRequisition) return

    await removeRequisition(deletingRequisition.requisitionCode)
    setIsDeleteDialogOpen(false)
    setDeletingRequisition(null)
  }

  async function handleSend(requisition: Requisition) {
    await sendRequisition(requisition.requisitionCode)
  }

  async function handleConfirmAction(payload: {
    decision?: string
    justification?: string
    opinion?: string
    budgetAvailability?: string
    authorizedQuantity?: number
    budgetExercise?: string
    observation?: string
  }) {
    if (!actionRequisition || !currentAction) return

    if (currentAction === 'cancel') {
      await cancelRequisition({
        code: actionRequisition.requisitionCode,
        data: payload as CancelRequisitionDTO,
      })
    }

    if (currentAction === 'rh') {
      await analyzeRh({
        code: actionRequisition.requisitionCode,
        data: payload as AnalyzeRequisitionRhDTO,
      })
    }

    if (currentAction === 'financial') {
      await analyzeFinancial({
        code: actionRequisition.requisitionCode,
        data: payload as AnalyzeRequisitionFinancialDTO,
      })
    }

    setIsActionDialogOpen(false)
    setCurrentAction(null)
    setActionRequisition(null)
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
                <BreadcrumbPage>Requisições de Vaga</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">
            Requisições de Vaga
          </h1>
          <p className="text-muted-foreground">
            Consultar, registrar e acompanhar o fluxo de aprovação de
            requisições
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

          {canWriteRequisitions && (
            <Button onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Requisição
            </Button>
          )}
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-5">
          <div className="space-y-2">
            <Label>Código</Label>
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                resetPage()
              }}
              placeholder="Pesquisar por código"
            />
          </div>

          <div className="space-y-2">
            <Label>Solicitante</Label>
            <Input
              value={requesterName}
              onChange={(event) => {
                setRequesterName(event.target.value)
                resetPage()
              }}
              placeholder="Pesquisar solicitante"
            />
          </div>

          <div className="space-y-2">
            <Label>Departamento</Label>
            <Select
              value={departmentId}
              onValueChange={(value) => {
                setDepartmentId(value)
                setCostCenterId('all')
                resetPage()
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os departamentos</SelectItem>
                {departmentsData?.data.map((department) => (
                  <SelectItem
                    key={department.code}
                    value={String(department.code)}
                  >
                    {department.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Centro de custo</Label>
            <Select
              value={costCenterId}
              onValueChange={(value) => {
                setCostCenterId(value)
                resetPage()
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Centro de custo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os centros de custo</SelectItem>
                {costCentersData?.data.map((costCenter) => (
                  <SelectItem
                    key={costCenter.code}
                    value={String(costCenter.code)}
                  >
                    {costCenter.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={stateId}
              onValueChange={(value) => {
                setStateId(value)
                resetPage()
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                {statesData?.data.map((state) => (
                  <SelectItem key={state.code} value={String(state.code)}>
                    {state.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cargo</Label>
            <Select
              value={positionId}
              onValueChange={(value) => {
                setPositionId(value)
                resetPage()
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cargos</SelectItem>
                {positionsData?.data.map((position) => (
                  <SelectItem key={position.code} value={String(position.code)}>
                    {position.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de contratação</Label>
            <Select
              value={hiringTypeId}
              onValueChange={(value) => {
                setHiringTypeId(value)
                resetPage()
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de contratação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {hiringTypesData?.data.map((hiringType) => (
                  <SelectItem
                    key={hiringType.code}
                    value={String(hiringType.code)}
                  >
                    {hiringType.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de requisição</Label>
            <Select
              value={vacancyRequestTypeId}
              onValueChange={(value) => {
                setVacancyRequestTypeId(value)
                resetPage()
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de requisição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {vacancyRequestTypesData?.data.map((vacancyRequestType) => (
                  <SelectItem
                    key={vacancyRequestType.id}
                    value={String(vacancyRequestType.id)}
                  >
                    {vacancyRequestType.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data inicial</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(event) => {
                setStartDate(event.target.value)
                resetPage()
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Data final</Label>
            <Input
              type="date"
              value={endDate}
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
                <TableHead>Departamento</TableHead>
                <TableHead>Centro de custo</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Tipo de requisição</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Solicitante</TableHead>
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
                      <FileText className="h-8 w-8 text-destructive" />
                      <span className="font-medium text-destructive">
                        Erro ao carregar requisições
                      </span>
                      <span className="text-sm">
                        Não foi possível buscar os dados. Tente novamente mais
                        tarde.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : requisitionRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <FileText className="h-8 w-8" />
                      <span>Nenhuma requisição encontrada.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                requisitionRecords.map((requisition) => (
                  <TableRow key={requisition.requisitionCode}>
                    <TableCell className="font-medium">
                      {requisition.requisitionCode}
                    </TableCell>
                    <TableCell>
                      {emptyValue(requisition.department.description)}
                    </TableCell>
                    <TableCell>
                      {emptyValue(requisition.costCenter.description)}
                    </TableCell>
                    <TableCell>
                      {emptyValue(requisition.position.description)}
                    </TableCell>
                    <TableCell>
                      {emptyValue(
                        requisition.vacancyRequestType?.description,
                      )}
                    </TableCell>
                    <TableCell>{requisition.quantity}</TableCell>
                    <TableCell>
                      <RequisitionStatusBadge
                        acronym={requisition.state.acronym}
                        description={requisition.state.description}
                      />
                    </TableCell>
                    <TableCell>{emptyValue(requisition.requester.name)}</TableCell>
                    <TableCell>{formatDate(requisition.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDetailsModal(requisition)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver detalhes</TooltipContent>
                        </Tooltip>

                        {canWriteRequisitions && isDraft(requisition) && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditModal(requisition)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Editar requisição</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isSending}
                                  onClick={() => handleSend(requisition)}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Enviar para aprovação</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isRemoving}
                                  onClick={() => openDeleteDialog(requisition)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Remover requisição</TooltipContent>
                            </Tooltip>
                          </>
                        )}

                        {canWriteRequisitions &&
                          requisition.state.acronym === 'AGUARDANDO_RH' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  openActionDialog('rh', requisition)
                                }
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Analisar pelo RH</TooltipContent>
                          </Tooltip>
                        )}

                        {canWriteRequisitions &&
                          requisition.state.acronym ===
                          'AGUARDANDO_FINANCEIRO' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  openActionDialog('financial', requisition)
                                }
                              >
                                <BadgeDollarSign className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Analisar pelo financeiro
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {canWriteRequisitions && canCancel(requisition) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  openActionDialog('cancel', requisition)
                                }
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Cancelar requisição</TooltipContent>
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

      <RequisitionFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        requisition={editingRequisition}
      />

      <RequisitionDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={(open) => {
          setIsDetailsModalOpen(open)

          if (!open) {
            setDetailsRequisition(null)
          }
        }}
        requisition={requisitionDetails ?? detailsRequisition}
      />

      <RequisitionDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open)

          if (!open) {
            setDeletingRequisition(null)
          }
        }}
        requisition={deletingRequisition}
        loading={isRemoving}
        onConfirm={handleConfirmRemove}
      />

      <RequisitionActionDialog
        open={isActionDialogOpen}
        onOpenChange={(open) => {
          setIsActionDialogOpen(open)

          if (!open) {
            setCurrentAction(null)
            setActionRequisition(null)
          }
        }}
        action={currentAction}
        requisition={actionRequisition}
        loading={actionLoading}
        onConfirm={handleConfirmAction}
      />
    </div>
  )
}
