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
import { EmployeeBankModal } from './components/employee-bank-modal'
import { EmployeeFilters } from './components/employee-filters'
import { EmployeeTable } from './components/employee-table'
import { Pagination } from '@/components/table/pagination'
import { useUsersQuery } from '@/hooks/users'
import { cn } from '@/lib/utils'
import type { User } from '@/services/users/users.types'
import { UserDirectPermissionsModal } from './components/user-direct-permissions-modal'
import { UserGroupsModal } from './components/user-groups-modal'

export function ListUsers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isEmployeeBankModalOpen, setIsEmployeeBankModalOpen] = useState(false)
  const [isUserGroupsModalOpen, setIsUserGroupsModalOpen] = useState(false)
  const [isDirectPermissionsModalOpen, setIsDirectPermissionsModalOpen] =
    useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { data, isLoading, isError, refetch, isFetching } = useUsersQuery({
    page,
    limit,
    name: searchTerm || undefined,
  })

  const users = data?.data ?? []
  const meta = data?.meta

  const openCreateModal = () => {
    setEditingUser(null)
    setIsUserModalOpen(true)
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setIsUserModalOpen(true)
  }

  const openCreateEmployeeModal = (user: User) => {
    setSelectedUser(user)
    setIsEmployeeBankModalOpen(true)
  }

  const openUserGroupsModal = (user: User) => {
    setSelectedUser(user)
    setIsUserGroupsModalOpen(true)
  }

  const openDirectPermissionsModal = (user: User) => {
    setSelectedUser(user)
    setIsDirectPermissionsModalOpen(true)
  }

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
                <BreadcrumbPage>Utilizadores</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">Utilizadores</h1>
          <p className="text-muted-foreground">
            Consulte utilizadores e cadastre colaboradores a partir da listagem
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Utilizador
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
          users={users}
          loading={loading}
          isError={isError}
          onEdit={openEditModal}
          onRegisterEmployee={openCreateEmployeeModal}
          onManageGroups={openUserGroupsModal}
          onManageDirectPermissions={openDirectPermissionsModal}
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
        open={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        user={editingUser}
      />
      <EmployeeBankModal
        open={isEmployeeBankModalOpen}
        onOpenChange={setIsEmployeeBankModalOpen}
        user={selectedUser}
      />
      <UserGroupsModal
        open={isUserGroupsModalOpen}
        onOpenChange={setIsUserGroupsModalOpen}
        user={selectedUser}
      />
      <UserDirectPermissionsModal
        open={isDirectPermissionsModalOpen}
        onOpenChange={setIsDirectPermissionsModalOpen}
        user={selectedUser}
      />
    </div>
  )
}
