import { useMemo, useState } from 'react'
import { CalendarDays, Pencil, Plus, RefreshCcw, Trash2 } from 'lucide-react'

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
import {
  useRemoveVacationMutation,
  useVacationsQuery,
} from '@/hooks/vacations'
import { cn } from '@/lib/utils'
import type { Vacation } from '@/services/vacations/vacations.types'
import { VacationDeleteDialog } from './components/vacation-delete-dialog'
import { VacationFormModal } from './components/vacation-form-modal'
import { VacationStatusBadge } from './components/vacation-status-badge'

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

export function ListVacations() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVacation, setEditingVacation] = useState<Vacation | null>(null)
  const [deletingVacation, setDeletingVacation] = useState<Vacation | null>(
    null,
  )
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { mutateAsync: removeVacation, isPending: isRemoving } =
    useRemoveVacationMutation()

  const { data, isLoading, isError, refetch, isFetching } = useVacationsQuery({
    page,
    limit,
  })

  const vacationRecords = useMemo(() => data?.data ?? [], [data])
  const meta = data?.meta
  const total = meta?.total ?? 0
  const totalPages = meta?.totalPages ?? 1
  const currentPage = meta?.page ?? page
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const rangeEnd = Math.min(currentPage * limit, total)
  const loading = isLoading || isFetching

  function openCreateModal() {
    setEditingVacation(null)
    setIsModalOpen(true)
  }

  function openEditModal(vacation: Vacation) {
    setEditingVacation(vacation)
    setIsModalOpen(true)
  }

  function openDeleteDialog(vacation: Vacation) {
    setDeletingVacation(vacation)
    setIsDeleteDialogOpen(true)
  }

  async function handleConfirmRemove() {
    if (!deletingVacation) return

    await removeVacation(String(deletingVacation.id))
    setIsDeleteDialogOpen(false)
    setDeletingVacation(null)
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
                <BreadcrumbPage>Férias</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">Férias</h1>
          <p className="text-muted-foreground">
            Consultar e registrar férias de colaboradores
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

          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Registrar Férias
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
                <TableHead>Dias</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Gestor aprovador</TableHead>
                <TableHead>RH aprovador</TableHead>
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
                      <CalendarDays className="h-8 w-8 text-destructive" />
                      <span className="font-medium text-destructive">
                        Erro ao carregar férias
                      </span>
                      <span className="text-sm">
                        Não foi possível buscar os dados. Tente novamente mais
                        tarde.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : vacationRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <CalendarDays className="h-8 w-8" />
                      <span>Nenhum registro de férias encontrado.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                vacationRecords.map((vacation) => (
                  <TableRow key={vacation.id}>
                    <TableCell>{vacation.id}</TableCell>
                    <TableCell className="font-medium">
                      {vacation.employeeName}
                    </TableCell>
                    <TableCell>{formatDate(vacation.startDate)}</TableCell>
                    <TableCell>{formatDate(vacation.endDate)}</TableCell>
                    <TableCell>{vacation.days}</TableCell>
                    <TableCell>
                      <VacationStatusBadge status={vacation.status} />
                    </TableCell>
                    <TableCell>
                      {emptyValue(vacation.approverManagerName)}
                    </TableCell>
                    <TableCell>{emptyValue(vacation.approverRhName)}</TableCell>
                    <TableCell>{formatDate(vacation.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(vacation)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar férias</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isRemoving}
                              onClick={() => openDeleteDialog(vacation)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remover férias</TooltipContent>
                        </Tooltip>
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

      <VacationFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        vacation={editingVacation}
      />

      <VacationDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open)

          if (!open) {
            setDeletingVacation(null)
          }
        }}
        vacation={deletingVacation}
        loading={isRemoving}
        onConfirm={handleConfirmRemove}
      />
    </div>
  )
}
