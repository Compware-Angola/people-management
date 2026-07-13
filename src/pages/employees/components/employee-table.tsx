import { Archive, Eye, Pencil, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'


import { TableGroupRowSkeleton } from '@/components/table/table-skeleton'
import type { Employee } from '@/services/employees/employees.types'

export type EmployeeTableProps= {
  employees: Employee[]
  loading: boolean
  onView: (employee: Employee) => void
  onEdit: (employee: Employee) => void
  onArchive: (employee: Employee) => void
  isError?: boolean
}

export function EmployeeTable({
  employees,
  loading,
  onView,
  onEdit,
  onArchive,
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
                    Erro ao carregar colaboradores
                  </span>
                  <span className="text-sm">
                    Não foi possível buscar os dados.
                    Tente novamente mais tarde.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Users className="h-8 w-8" />
                  <span>Nenhum colaborador encontrado.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>

                <TableCell>{employee.bi}</TableCell>

                <TableCell>{employee.nif}</TableCell>

                <TableCell>{employee.phone}</TableCell>

                <TableCell>{employee.province}</TableCell>

                <TableCell>{employee.email}</TableCell>

                <TableCell>
                  {employee.status === 1 ? (
                    <Badge className="bg-emerald-100 text-emerald-700">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inativo</Badge>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(employee)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>Ver detalhes</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(employee)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>Editar</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={employee.status === 0}
                            onClick={() => onArchive(employee)}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>Arquivar</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}