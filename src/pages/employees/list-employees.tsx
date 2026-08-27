import { useEffect, useState } from 'react'
import { Eye, Pencil, RefreshCcw, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { EmployeeFilters } from './components/employee-filters'
import { EmployeeStatusBadge } from './components/employee-status-badge'
import { EmployeeBankModal } from './components/employee-bank-modal'
import { EmployeeDetailsModal } from './components/employee-details-modal'
import { Pagination } from '@/components/table/pagination'
import { employeesListQueryOptions, useEmployeesQuery } from '@/hooks/employees'
import { cn } from '@/lib/utils'
import type { Employee } from '@/services/employees/employees.types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableGroupRowSkeleton } from '@/components/table/table-skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useMyPermissionQuery } from '@/hooks/permissions'
import { hasPermission } from '@/utils/permissions.util'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { Toolbar } from '@/components/toolbar'
import { queryClient } from '@/lib/query-client'

export function ListEmployees() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [detailsEmployeeId, setDetailsEmployeeId] = useState<number | null>(
    null,
  )
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const { data: myPermissions } = useMyPermissionQuery()
  const { data, isLoading, isError, refetch, isFetching } = useEmployeesQuery({
    page,
    limit,
  })

  const permissions = myPermissions?.permissions ?? []
  const canWriteEmployees = hasPermission(
    permissions,
    PermissionsEnum.WRITE_EMPLOYEES,
  )
  const employees = data?.data ?? []
  const meta = data?.meta
  const filteredEmployees = searchTerm
    ? employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : employees

  const total = meta?.total ?? 0
  const totalPages = meta?.totalPages ?? 1
  const currentPage = meta?.page ?? page
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const rangeEnd = Math.min(currentPage * limit, total)
  const loading = isLoading || isFetching
  useEffect(() => {
    if (page >= totalPages) return

    queryClient.prefetchQuery(
      employeesListQueryOptions({
        page: page + 1,
        limit,
      }),
    )
  }, [page, limit, totalPages, queryClient])
  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsEditModalOpen(true)
  }
  const openDetailsModal = (employee: Employee) => {
    setDetailsEmployeeId(employee.id)
    setIsDetailsModalOpen(true)
  }

  function clearFilters() {
    setSearchTerm('')
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
                <BreadcrumbPage>Colaboradores</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">Colaboradores</h1>
          <p className="text-muted-foreground">
            Consultar colaboradores já cadastrados
          </p>
        </div>
        <Toolbar>
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
      <Card>
        <EmployeeFilters
          search={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value)
            setPage(1)
          }}
        />

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>BI</TableHead>
                <TableHead>NIF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Província</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>IBAN</TableHead>
                <TableHead>Estado</TableHead>
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
                      <Users className="h-8 w-8 text-destructive" />
                      <span className="font-medium text-destructive">
                        Erro ao carregar colaboradores
                      </span>
                      <span className="text-sm">
                        Não foi possível buscar os dados. Tente novamente mais
                        tarde.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Users className="h-8 w-8" />
                      <span>Nenhum colaborador encontrado.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      {employee.name}
                    </TableCell>
                    <TableCell>{employee.bi}</TableCell>
                    <TableCell>{employee.nif}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.province}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.bank}</TableCell>
                    <TableCell>{employee.iban}</TableCell>
                    <TableCell>
                      <EmployeeStatusBadge status={employee.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDetailsModal(employee)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>

                          <TooltipContent>Ver detalhes</TooltipContent>
                        </Tooltip>

                        {canWriteEmployees && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditModal(employee)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>

                            <TooltipContent>Editar colaborador</TooltipContent>
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
          onPageHover={(pageNumber) => {
            queryClient.prefetchQuery(
              employeesListQueryOptions({
                page: pageNumber,
                limit,
              }),
            )
          }}
        />
      </Card>
      <EmployeeBankModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        employee={editingEmployee}
      />
      <EmployeeDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        employeeId={detailsEmployeeId}
      />
    </div>
  )
}
