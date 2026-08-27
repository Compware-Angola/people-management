import { useMemo, useState } from 'react'
import { Building2, Pencil, Plus, RefreshCcw, Trash2, X } from 'lucide-react'

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
  useDepartmentsQuery,
  useRemoveDepartmentMutation,
} from '@/hooks/departments'
import { useAuth } from '@/hooks/auth'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { formatDatePtAO } from '@/lib/date/format-date-pt-ao'
import { cn } from '@/lib/utils'
import type {
  Department,
  DepartmentStatus,
} from '@/services/departments/departments.types'
import { DepartmentDeleteDialog } from './components/department-delete-dialog'
import { DepartmentFormModal } from './components/department-form-modal'
import { DepartmentStatusBadge } from './components/department-status-badge'
import { Toolbar } from '@/components/toolbar'

export function ListDepartments() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] =
    useState<Department | null>(null)
  const [deletingDepartment, setDeletingDepartment] =
    useState<Department | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { can } = useAuth()
  const canWriteDepartments = can(PermissionsEnum.WRITE_DEPARTMENTS)
  const { mutateAsync: removeDepartment, isPending: isRemoving } =
    useRemoveDepartmentMutation()

  const { data, isLoading, isError, refetch, isFetching } =
    useDepartmentsQuery({
      page,
      limit,
      ...(search ? { search } : {}),
      ...(status !== 'all'
        ? { status: Number(status) as DepartmentStatus }
        : {}),
    })

  const departmentRecords = useMemo(() => data?.data ?? [], [data])
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
    setEditingDepartment(null)
    setIsModalOpen(true)
  }

  function openEditModal(department: Department) {
    setEditingDepartment(department)
    setIsModalOpen(true)
  }

  function openDeleteDialog(department: Department) {
    setDeletingDepartment(department)
    setIsDeleteDialogOpen(true)
  }

  async function handleConfirmRemove() {
    if (!deletingDepartment) return

    await removeDepartment(deletingDepartment.code)
    setIsDeleteDialogOpen(false)
    setDeletingDepartment(null)
  }

    function clearFilters() {
    setSearch('')
    setStatus("all")
    setPage(1)
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Departamentos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">Departamentos</h1>
          <p className="text-muted-foreground">
            Consultar e gerir departamentos usados nos fluxos de pessoas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Toolbar>
            {canWriteDepartments && (
            <Button onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Departamento
            </Button>
          )}
          <Button variant="outline" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
             <Button variant="outline" onClick={() => refetch()}>
            <RefreshCcw
              className={cn(
                'mr-2 h-4 w-4',
                !isLoading && isFetching && 'animate-spin',
              )}
            />
            Atualizar
          </Button>

          
          </Toolbar>
         
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Descrição do departamento</Label>
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
                <TableErrorState
                  columns={5}
                  icon={Building2}
                  title="Erro ao carregar departamentos"
                />
              ) : departmentRecords.length === 0 ? (
                <TableEmptyState
                  columns={5}
                  icon={Building2}
                  title="Nenhum departamento encontrado."
                />
              ) : (
                departmentRecords.map((department) => (
                  <TableRow key={department.code}>
                    <TableCell>{department.code}</TableCell>
                    <TableCell className="font-medium">
                      {department.description}
                    </TableCell>
                    <TableCell>
                      <DepartmentStatusBadge status={department.status} />
                    </TableCell>
                    <TableCell>
                      {formatDatePtAO(department.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {canWriteDepartments && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditModal(department)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Editar departamento
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isRemoving}
                                  onClick={() => openDeleteDialog(department)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Remover departamento
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
          loading
        />
      </Card>

      <DepartmentFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        department={editingDepartment}
      />

      <DepartmentDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        department={deletingDepartment}
        loading={isRemoving}
        onConfirm={handleConfirmRemove}
      />
    </div>
  )
}
