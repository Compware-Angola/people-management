import { useState } from 'react'
import { Plus, RefreshCcw } from 'lucide-react'
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
import { EmployeeFormModal } from './components/employee-form-modal'
import type {
  

} from './components/employee-form-modal'
import { EmployeeFilters } from './components/employee-filters'
import { EmployeeTable } from './components/employee-table'
import { Pagination } from '@/components/table/pagination'
import { useEmployeesQuery } from '@/hooks/employees'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Employee } from '@/services/employees/employees.types'

export function ListEmployees() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const { data, isLoading, isError, refetch, isFetching } = useEmployeesQuery({
    page,
    limit,
  })

  const employees = data?.data ?? []
  const meta = data?.meta
  const openCreateModal = () => {
    setEditingEmployee(null)
    setIsModalOpen(true)
  }

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee)

    setIsModalOpen(true)
  }

  /**
   * Temporário:
   * depois será mutation de archive
   */
  const handleArchive = (employee: Employee) => {
    toast.info('Arquivar colaborador', {
      description: `${employee.name} será arquivado.`,
    })
  }

  const filteredEmployees = employees.filter((employee) => {
    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      return true
    }
    return (
      employee.name.toLowerCase().includes(term) ||
      employee.bi.toLowerCase().includes(term) ||
      employee.nif.toLowerCase().includes(term) ||
      employee.email.toLowerCase().includes(term)
    )
  })

  const total = meta?.total ?? 0
  const totalPages = meta?.totalPages ?? 1
  const currentPage = meta?.page ?? page
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const rangeEnd = Math.min(currentPage * limit, total)
  const loading = isLoading || isFetching

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
                <BreadcrumbPage>Colaboradores</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">Colaboradores</h1>
          <p className="text-muted-foreground">
            Consultar e gerir os colaboradores registados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Colaborador
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
        </div>
      </div>
      <Card>
        <EmployeeFilters
          search={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value)
            setPage(1)
          }}
        />

        <EmployeeTable
          employees={filteredEmployees}
          loading={loading}
          onView={() => {}}
          isError={isError}
          onEdit={openEditModal}
          onArchive={handleArchive}
        />

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
      <EmployeeFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        employee={editingEmployee}
      />
    </div>
  )
}
