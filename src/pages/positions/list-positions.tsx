import { useMemo, useState } from 'react'
import { BriefcaseBusiness, Pencil, Plus, RefreshCcw, Trash2 } from 'lucide-react'

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
import {
  usePositionsQuery,
  useRemovePositionMutation,
} from '@/hooks/positions'
import { cn } from '@/lib/utils'
import type {
  Position,
  PositionStatus,
} from '@/services/positions/positions.types'
import { PositionDeleteDialog } from './components/position-delete-dialog'
import { PositionFormModal } from './components/position-form-modal'
import { PositionStatusBadge } from './components/position-status-badge'

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

export function ListPositions() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPosition, setEditingPosition] = useState<Position | null>(null)
  const [deletingPosition, setDeletingPosition] =
    useState<Position | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { mutateAsync: removePosition, isPending: isRemoving } =
    useRemovePositionMutation()

  const { data, isLoading, isError, refetch, isFetching } = usePositionsQuery({
    page,
    limit,
    ...(search ? { search } : {}),
    ...(status !== 'all' ? { status: Number(status) as PositionStatus } : {}),
  })

  const positionRecords = useMemo(() => data?.data ?? [], [data])
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
    setEditingPosition(null)
    setIsModalOpen(true)
  }

  function openEditModal(position: Position) {
    setEditingPosition(position)
    setIsModalOpen(true)
  }

  function openDeleteDialog(position: Position) {
    setDeletingPosition(position)
    setIsDeleteDialogOpen(true)
  }

  async function handleConfirmRemove() {
    if (!deletingPosition) return

    await removePosition(deletingPosition.code)
    setIsDeleteDialogOpen(false)
    setDeletingPosition(null)
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
                <BreadcrumbPage>Cargos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">Cargos</h1>
          <p className="text-muted-foreground">
            Consultar e gerir cargos usados nos fluxos de pessoas
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
            Novo Cargo
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Descrição do cargo</Label>
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                resetPage()
              }}
              placeholder="Pesquisar por descrição"
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
                <SelectItem value="1">Ativo</SelectItem>
                <SelectItem value="0">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableGroupRowSkeleton rows={10} columns={5} />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <BriefcaseBusiness className="h-8 w-8 text-destructive" />
                      <span className="font-medium text-destructive">
                        Erro ao carregar cargos
                      </span>
                      <span className="text-sm">
                        Não foi possível buscar os dados. Tente novamente mais
                        tarde.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : positionRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <BriefcaseBusiness className="h-8 w-8" />
                      <span>Nenhum cargo encontrado.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                positionRecords.map((position) => (
                  <TableRow key={position.code}>
                    <TableCell>{position.code}</TableCell>
                    <TableCell className="font-medium">
                      {position.description}
                    </TableCell>
                    <TableCell>
                      <PositionStatusBadge status={position.status} />
                    </TableCell>
                    <TableCell>{formatDate(position.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(position)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar cargo</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isRemoving}
                              onClick={() => openDeleteDialog(position)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remover cargo</TooltipContent>
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

      <PositionFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        position={editingPosition}
      />

      <PositionDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open)

          if (!open) {
            setDeletingPosition(null)
          }
        }}
        position={deletingPosition}
        loading={isRemoving}
        onConfirm={handleConfirmRemove}
      />
    </div>
  )
}
