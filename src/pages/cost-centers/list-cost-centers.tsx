import { useMemo, useState } from 'react'
import { Landmark, Pencil, Plus, RefreshCcw, Trash2 } from 'lucide-react'

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
  useCostCentersQuery,
  useRemoveCostCenterMutation,
} from '@/hooks/cost-centers'
import { useDepartmentsQuery } from '@/hooks/departments'
import { useAuth } from '@/hooks/auth'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { formatDatePtAO } from '@/lib/date/format-date-pt-ao'
import { cn } from '@/lib/utils'
import type {
  CostCenter,
  CostCenterStatus,
} from '@/services/cost-centers/cost-centers.types'
import { CostCenterDeleteDialog } from './components/cost-center-delete-dialog'
import { CostCenterFormModal } from './components/cost-center-form-modal'
import { CostCenterStatusBadge } from './components/cost-center-status-badge'

export function ListCostCenters() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('all')
  const [status, setStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCostCenter, setEditingCostCenter] =
    useState<CostCenter | null>(null)
  const [deletingCostCenter, setDeletingCostCenter] =
    useState<CostCenter | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { can } = useAuth()
  const canWriteCostCenters = can(PermissionsEnum.WRITE_COST_CENTERS)
  const { mutateAsync: removeCostCenter, isPending: isRemoving } =
    useRemoveCostCenterMutation()

  const { data: departmentsData } = useDepartmentsQuery({
    page: 1,
    limit: 100,
    status: 1,
  })

  const { data, isLoading, isError, refetch, isFetching } =
    useCostCentersQuery({
      page,
      limit,
      ...(search ? { search } : {}),
      ...(departmentId !== 'all'
        ? { departmentId: Number(departmentId) }
        : {}),
      ...(status !== 'all'
        ? { status: Number(status) as CostCenterStatus }
        : {}),
    })

  const costCenterRecords = useMemo(() => data?.data ?? [], [data])
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
    setEditingCostCenter(null)
    setIsModalOpen(true)
  }

  function openEditModal(costCenter: CostCenter) {
    setEditingCostCenter(costCenter)
    setIsModalOpen(true)
  }

  function openDeleteDialog(costCenter: CostCenter) {
    setDeletingCostCenter(costCenter)
    setIsDeleteDialogOpen(true)
  }

  async function handleConfirmRemove() {
    if (!deletingCostCenter) return

    await removeCostCenter(deletingCostCenter.code)
    setIsDeleteDialogOpen(false)
    setDeletingCostCenter(null)
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
                <BreadcrumbPage>Centros de Custo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">
            Centros de Custo
          </h1>
          <p className="text-muted-foreground">
            Consultar e gerir centros de custo vinculados aos departamentos
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

          {canWriteCostCenters && (
            <Button onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Centro de Custo
            </Button>
          )}
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Descrição do centro de custo</Label>
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
                <TableHead>Departamento</TableHead>
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
                  icon={Landmark}
                  title="Erro ao carregar centros de custo"
                />
              ) : costCenterRecords.length === 0 ? (
                <TableEmptyState
                  columns={6}
                  icon={Landmark}
                  title="Nenhum centro de custo encontrado."
                />
              ) : (
                costCenterRecords.map((costCenter) => (
                  <TableRow key={costCenter.code}>
                    <TableCell>{costCenter.code}</TableCell>
                    <TableCell>
                      {costCenter.department?.description ?? '-'}
                    </TableCell>
                    <TableCell className="font-medium">
                      {costCenter.description}
                    </TableCell>
                    <TableCell>
                      <CostCenterStatusBadge status={costCenter.status} />
                    </TableCell>
                    <TableCell>
                      {formatDatePtAO(costCenter.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {canWriteCostCenters && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditModal(costCenter)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Editar centro de custo
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isRemoving}
                                  onClick={() => openDeleteDialog(costCenter)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Remover centro de custo
                              </TooltipContent>
                            </Tooltip>
                          </>
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
          onPageChange={setPage}
          onLimitChange={(value) => {
            setLimit(value)
            setPage(1)
          }}
        />
      </Card>

      <CostCenterFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        costCenter={editingCostCenter}
      />

      <CostCenterDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        costCenter={deletingCostCenter}
        loading={isRemoving}
        onConfirm={handleConfirmRemove}
      />
    </div>
  )
}
