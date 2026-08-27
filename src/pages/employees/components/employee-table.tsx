import { Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'



import { TableGroupRowSkeleton } from '@/components/table/table-skeleton'
import type { User } from '@/services/users/users.types'
import { EmployeeTableActions } from './employee-table-actions'

export type EmployeeTableProps = {
  users: User[]
  loading: boolean
  onEdit: (user: User) => void
  onRegisterEmployee: (user: User) => void
  onManageGroups: (user: User) => void
  onManageDirectPermissions: (user: User) => void
  canEditUser: boolean
  canRegisterEmployee: boolean
  canManageGroups: boolean
  canManageDirectPermissions: boolean
  isError?: boolean
}

export function EmployeeTable({
  users,
  loading,
  onEdit,
  onRegisterEmployee,
  onManageGroups,
  onManageDirectPermissions,
  canEditUser,
  canRegisterEmployee,
  canManageGroups,
  canManageDirectPermissions,
  isError,
}: EmployeeTableProps) {
  return (
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
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableGroupRowSkeleton rows={10} columns={8} />
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={8} className="h-40 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Users className="h-8 w-8 text-destructive" />
                  <span className="font-medium text-destructive">
                    Erro ao carregar utilizadores
                  </span>
                  <span className="text-sm">
                    Não foi possível buscar os dados.
                    Tente novamente mais tarde.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Users className="h-8 w-8" />
                  <span>Nenhum utilizador encontrado.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.bi}</TableCell>
                <TableCell>{user.nif}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.province}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.status === 1 ? (
                    <Badge className="bg-emerald-100 text-emerald-700">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <EmployeeTableActions
                    user={user}
                    onEdit={onEdit}
                    onRegisterEmployee={onRegisterEmployee}
                    onManageGroups={onManageGroups}
                    onManageDirectPermissions={onManageDirectPermissions}
                    canEditUser={canEditUser}
                    canRegisterEmployee={canRegisterEmployee}
                    canManageGroups={canManageGroups}
                    canManageDirectPermissions={canManageDirectPermissions}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
