import { useMemo, useState } from 'react'
import {
  Ban,
  BriefcaseBusiness,
  CalendarClock,
  Eye,
  FileText,
  Paperclip,
  Pencil,
  Play,
  Plus,
  RefreshCcw,
  RotateCcw,
  Square,
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
import { useDepartmentsQuery } from '@/hooks/departments'
import { useHiringTypesQuery } from '@/hooks/hiring-types'
import { usePositionsQuery } from '@/hooks/positions'
import { useAuth } from '@/hooks/auth'
import {
  useCancelVacancyMutation,
  useCloseVacancyMutation,
  usePublishVacancyMutation,
  useReactivateVacancyMutation,
  useSuspendVacancyMutation,
  useVacanciesQuery,
  useVacancyDetailsQuery,
} from '@/hooks/vacancies'
import { useVacancyStatesQuery } from '@/hooks/vacancy-states'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { cn } from '@/lib/utils'
import type {
  Vacancy,
  VacancyActionDTO,
} from '@/services/vacancies/vacancies.types'
import {
  VacancyActionDialog,
  type VacancyAction,
} from './components/vacancy-action-dialog'
import { VacancyDetailsModal } from './components/vacancy-details-modal'
import { VacancyDocumentModal } from './components/vacancy-document-modal'
import { VacancyFormModal } from './components/vacancy-form-modal'
import { VacancyStatusBadge } from './components/vacancy-status-badge'

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

function canEdit(vacancy: Vacancy) {
  return ['RASCUNHO', 'AGENDADA'].includes(vacancy.state?.acronym ?? '')
}

function canPublish(vacancy: Vacancy) {
  return ['RASCUNHO', 'AGENDADA'].includes(vacancy.state?.acronym ?? '')
}

function canSuspend(vacancy: Vacancy) {
  return vacancy.state?.acronym === 'PUBLICADA'
}

function canReactivate(vacancy: Vacancy) {
  return vacancy.state?.acronym === 'SUSPENSA'
}

function canClose(vacancy: Vacancy) {
  return ['PUBLICADA', 'SUSPENSA'].includes(vacancy.state?.acronym ?? '')
}

function canCancel(vacancy: Vacancy) {
  return ['RASCUNHO', 'AGENDADA', 'PUBLICADA', 'SUSPENSA'].includes(
    vacancy.state?.acronym ?? '',
  )
}

export function ListVacancies() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [stateId, setStateId] = useState('all')
  const [positionId, setPositionId] = useState('all')
  const [departmentId, setDepartmentId] = useState('all')
  const [hiringTypeId, setHiringTypeId] = useState('all')
  const [publicationStart, setPublicationStart] = useState('')
  const [publicationEnd, setPublicationEnd] = useState('')
  const [closingStart, setClosingStart] = useState('')
  const [closingEnd, setClosingEnd] = useState('')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null)
  const [detailsVacancy, setDetailsVacancy] = useState<Vacancy | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [documentVacancy, setDocumentVacancy] = useState<Vacancy | null>(null)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [actionVacancy, setActionVacancy] = useState<Vacancy | null>(null)
  const [currentAction, setCurrentAction] = useState<VacancyAction | null>(null)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const { can } = useAuth()
  const canWriteVacancies = can(PermissionsEnum.WRITE_VACANCIES)

  const { mutateAsync: publishVacancy, isPending: isPublishing } =
    usePublishVacancyMutation()
  const { mutateAsync: suspendVacancy, isPending: isSuspending } =
    useSuspendVacancyMutation()
  const { mutateAsync: reactivateVacancy, isPending: isReactivating } =
    useReactivateVacancyMutation()
  const { mutateAsync: closeVacancy, isPending: isClosing } =
    useCloseVacancyMutation()
  const { mutateAsync: cancelVacancy, isPending: isCancelling } =
    useCancelVacancyMutation()

  const params = {
    page,
    limit,
    ...(search ? { search } : {}),
    ...(stateId !== 'all' ? { stateId: Number(stateId) } : {}),
    ...(positionId !== 'all' ? { positionId: Number(positionId) } : {}),
    ...(departmentId !== 'all' ? { departmentId: Number(departmentId) } : {}),
    ...(hiringTypeId !== 'all' ? { hiringTypeId: Number(hiringTypeId) } : {}),
    ...(publicationStart ? { publicationStart } : {}),
    ...(publicationEnd ? { publicationEnd } : {}),
    ...(closingStart ? { closingStart } : {}),
    ...(closingEnd ? { closingEnd } : {}),
  }

  const { data, isLoading, isError, refetch, isFetching } =
    useVacanciesQuery(params)
  const { data: vacancyStatesData } = useVacancyStatesQuery({
    page: 1,
    limit: 100,
  })
  const { data: positionsData } = usePositionsQuery({
    page: 1,
    limit: 100,
    status: 1,
  })
  const { data: departmentsData } = useDepartmentsQuery({
    page: 1,
    limit: 100,
    status: 1,
  })
  const { data: hiringTypesData } = useHiringTypesQuery({
    page: 1,
    limit: 100,
    status: 1,
  })
  const { data: vacancyDetails } = useVacancyDetailsQuery(
    detailsVacancy?.vacancyCode,
  )

  const vacancyRecords = useMemo(() => data?.data ?? [], [data])
  const meta = data?.meta
  const total = meta?.total ?? 0
  const totalPages = meta?.totalPages ?? 1
  const currentPage = meta?.page ?? page
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const rangeEnd = Math.min(currentPage * limit, total)
  const loading = isLoading || isFetching
  const actionLoading =
    isPublishing || isSuspending || isReactivating || isClosing || isCancelling

  function resetPage() {
    setPage(1)
  }

  function openCreateModal() {
    setEditingVacancy(null)
    setIsFormModalOpen(true)
  }

  function openEditModal(vacancy: Vacancy) {
    setEditingVacancy(vacancy)
    setIsFormModalOpen(true)
  }

  function openDetailsModal(vacancy: Vacancy) {
    setDetailsVacancy(vacancy)
    setIsDetailsModalOpen(true)
  }

  function openDocumentModal(vacancy: Vacancy) {
    setDocumentVacancy(vacancy)
    setIsDocumentModalOpen(true)
  }

  function openActionDialog(action: VacancyAction, vacancy: Vacancy) {
    setCurrentAction(action)
    setActionVacancy(vacancy)
    setIsActionDialogOpen(true)
  }

  async function handleConfirmAction(payload: VacancyActionDTO) {
    if (!actionVacancy || !currentAction) return

    if (currentAction === 'publish') {
      await publishVacancy(actionVacancy.vacancyCode)
    }

    if (currentAction === 'suspend') {
      await suspendVacancy({
        code: actionVacancy.vacancyCode,
        data: payload,
      })
    }

    if (currentAction === 'reactivate') {
      await reactivateVacancy(actionVacancy.vacancyCode)
    }

    if (currentAction === 'close') {
      await closeVacancy({
        code: actionVacancy.vacancyCode,
        data: payload,
      })
    }

    if (currentAction === 'cancel') {
      await cancelVacancy({
        code: actionVacancy.vacancyCode,
        data: payload,
      })
    }

    setIsActionDialogOpen(false)
    setCurrentAction(null)
    setActionVacancy(null)
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
                <BreadcrumbPage>Vagas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">Vagas</h1>
          <p className="text-muted-foreground">
            Consultar e administrar vagas criadas a partir de requisições
            aprovadas
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

          {canWriteVacancies && (
            <Button onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Vaga
            </Button>
          )}
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Código da vaga</Label>
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
            <Label>Estado</Label>
            <Select
              value={stateId}
              onValueChange={(value) => {
                setStateId(value)
                resetPage()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                {vacancyStatesData?.data.map((state) => (
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
              <SelectTrigger className="w-full">
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
            <Label>Departamento</Label>
            <Select
              value={departmentId}
              onValueChange={(value) => {
                setDepartmentId(value)
                resetPage()
              }}
            >
              <SelectTrigger className="w-full">
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
            <Label>Tipo de contratação</Label>
            <Select
              value={hiringTypeId}
              onValueChange={(value) => {
                setHiringTypeId(value)
                resetPage()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tipo de contratação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {hiringTypesData?.data.map((hiringType) => (
                  <SelectItem
                    key={hiringType.code}
                    value={String(hiringType.code)}
                  >
                    {hiringType.acronym} - {hiringType.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Publicação inicial</Label>
            <Input
              type="date"
              value={publicationStart}
              onChange={(event) => {
                setPublicationStart(event.target.value)
                resetPage()
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Publicação final</Label>
            <Input
              type="date"
              value={publicationEnd}
              onChange={(event) => {
                setPublicationEnd(event.target.value)
                resetPage()
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Encerramento inicial</Label>
            <Input
              type="date"
              value={closingStart}
              onChange={(event) => {
                setClosingStart(event.target.value)
                resetPage()
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Encerramento final</Label>
            <Input
              type="date"
              value={closingEnd}
              onChange={(event) => {
                setClosingEnd(event.target.value)
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
                <TableHead>Cargo</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Nº vagas</TableHead>
                <TableHead>Publicação</TableHead>
                <TableHead>Encerramento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Req. origem</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableGroupRowSkeleton rows={10} columns={9} />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <BriefcaseBusiness className="h-8 w-8 text-destructive" />
                      <span className="font-medium text-destructive">
                        Erro ao carregar vagas
                      </span>
                      <span className="text-sm">
                        Não foi possível buscar os dados. Tente novamente mais
                        tarde.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : vacancyRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <FileText className="h-8 w-8" />
                      <span>Nenhuma vaga encontrada.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                vacancyRecords.map((vacancy) => (
                  <TableRow key={vacancy.vacancyCode}>
                    <TableCell className="font-medium">
                      {vacancy.vacancyCode}
                    </TableCell>
                    <TableCell>
                      {emptyValue(vacancy.position?.description)}
                    </TableCell>
                    <TableCell>
                      {emptyValue(vacancy.department?.description)}
                    </TableCell>
                    <TableCell>{vacancy.numberOfVacancies}</TableCell>
                    <TableCell>{formatDate(vacancy.publicationDate)}</TableCell>
                    <TableCell>{formatDate(vacancy.closingDate)}</TableCell>
                    <TableCell>
                      <VacancyStatusBadge
                        acronym={vacancy.state?.acronym}
                        description={vacancy.state?.description}
                      />
                    </TableCell>
                    <TableCell>
                      {emptyValue(vacancy.requisition?.requisitionCode)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDetailsModal(vacancy)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver detalhes</TooltipContent>
                        </Tooltip>

                        {canWriteVacancies && canEdit(vacancy) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditModal(vacancy)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar vaga</TooltipContent>
                          </Tooltip>
                        )}

                        {canWriteVacancies && canEdit(vacancy) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDocumentModal(vacancy)}
                              >
                                <Paperclip className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Anexar documento</TooltipContent>
                          </Tooltip>
                        )}

                        {canWriteVacancies && canPublish(vacancy) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  openActionDialog('publish', vacancy)
                                }
                              >
                                {vacancy.publicationDate ? (
                                  <CalendarClock className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Publicar ou agendar</TooltipContent>
                          </Tooltip>
                        )}

                        {canWriteVacancies && canSuspend(vacancy) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  openActionDialog('suspend', vacancy)
                                }
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Suspender vaga</TooltipContent>
                          </Tooltip>
                        )}

                        {canWriteVacancies && canReactivate(vacancy) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  openActionDialog('reactivate', vacancy)
                                }
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reativar vaga</TooltipContent>
                          </Tooltip>
                        )}

                        {canWriteVacancies && canClose(vacancy) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openActionDialog('close', vacancy)}
                              >
                                <Square className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Encerrar vaga</TooltipContent>
                          </Tooltip>
                        )}

                        {canWriteVacancies && canCancel(vacancy) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  openActionDialog('cancel', vacancy)
                                }
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Cancelar vaga</TooltipContent>
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
          limit={limit}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          loading={isLoading}
          onPageChange={setPage}
          onLimitChange={(value) => {
            setLimit(value)
            setPage(1)
          }}
        />
      </Card>

      <VacancyFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        vacancy={editingVacancy}
      />

      <VacancyDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        vacancy={vacancyDetails ?? detailsVacancy}
      />

      <VacancyDocumentModal
        open={isDocumentModalOpen}
        onOpenChange={setIsDocumentModalOpen}
        vacancy={documentVacancy}
      />

      <VacancyActionDialog
        open={isActionDialogOpen}
        action={currentAction}
        vacancy={actionVacancy}
        loading={actionLoading}
        onOpenChange={setIsActionDialogOpen}
        onConfirm={handleConfirmAction}
      />
    </div>
  )
}
