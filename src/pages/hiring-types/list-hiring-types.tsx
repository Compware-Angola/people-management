import { useMemo, useState } from 'react'
import { ClipboardType, Pencil, Plus, RefreshCcw, Trash2 } from 'lucide-react'

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
import {
  useHiringTypesQuery,
  useRemoveHiringTypeMutation,
} from '@/hooks/hiring-types'
import { formatDatePtAO } from '@/lib/date/format-date-pt-ao'
import { cn } from '@/lib/utils'
import type {
  HiringType,
  HiringTypeStatus,
} from '@/services/hiring-types/hiring-types.types'
import { HiringTypeDeleteDialog } from './components/hiring-type-delete-dialog'
import { HiringTypeFormModal } from './components/hiring-type-form-modal'
import { HiringTypeStatusBadge } from './components/hiring-type-status-badge'

export function ListHiringTypes() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [acronym, setAcronym] = useState('')
  const [status, setStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHiringType, setEditingHiringType] =
    useState<HiringType | null>(null)
  const [deletingHiringType, setDeletingHiringType] =
    useState<HiringType | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { mutateAsync: removeHiringType, isPending: isRemoving } =
    useRemoveHiringTypeMutation()

  const { data, isLoading, isError, refetch, isFetching } =
    useHiringTypesQuery({
      page,
      limit,
      ...(search ? { search } : {}),
      ...(acronym ? { acronym } : {}),
      ...(status !== 'all'
        ? { status: Number(status) as HiringTypeStatus }
        : {}),
    })

  const hiringTypeRecords = useMemo(() => data?.data ?? [], [data])
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
    setEditingHiringType(null)
    setIsModalOpen(true)
  }

  function openEditModal(hiringType: HiringType) {
    setEditingHiringType(hiringType)
    setIsModalOpen(true)
  }

  function openDeleteDialog(hiringType: HiringType) {
    setDeletingHiringType(hiringType)
    setIsDeleteDialogOpen(true)
  }

  async function handleConfirmRemove() {
    if (!deletingHiringType) return

    await removeHiringType(deletingHiringType.code)
    setIsDeleteDialogOpen(false)
    setDeletingHiringType(null)
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
                <BreadcrumbPage>Tipos de Contratação</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">
            Tipos de Contratação
          </h1>
          <p className="text-muted-foreground">
            Consultar e gerir tipos de contratação usados nas requisições de vaga
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
            Novo Tipo
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Descrição</Label>
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
            <Label>Sigla</Label>
            <Input
              value={acronym}
              onChange={(event) => {
                setAcronym(event.target.value)
                resetPage()
              }}
              placeholder="Ex: CTI"
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
                <TableHead>Sigla</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableGroupRowSkeleton rows={10} columns={6} />
              ) : isError ? (
                <TableErrorState
                  columns={6}
                  icon={ClipboardType}
                  title="Erro ao carregar tipos de contratação"
                />
              ) : hiringTypeRecords.length === 0 ? (
                <TableEmptyState
                  columns={6}
                  icon={ClipboardType}
                  title="Nenhum tipo de contratação encontrado."
                />
              ) : (
                hiringTypeRecords.map((hiringType) => (
                  <TableRow key={hiringType.code}>
                    <TableCell>{hiringType.code}</TableCell>
                    <TableCell className="font-medium">
                      {hiringType.acronym}
                    </TableCell>
                    <TableCell>{hiringType.description}</TableCell>
                    <TableCell>
                      <HiringTypeStatusBadge status={hiringType.status} />
                    </TableCell>
                    <TableCell>{formatDatePtAO(hiringType.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(hiringType)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Editar tipo de contratação
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isRemoving}
                              onClick={() => openDeleteDialog(hiringType)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Remover tipo de contratação
                          </TooltipContent>
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

      <HiringTypeFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        hiringType={editingHiringType}
      />

      <HiringTypeDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open)

          if (!open) {
            setDeletingHiringType(null)
          }
        }}
        hiringType={deletingHiringType}
        loading={isRemoving}
        onConfirm={handleConfirmRemove}
      />
    </div>
  )
}
