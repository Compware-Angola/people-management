import { useMemo, useState } from 'react'
import { CalendarCheck, Pencil, Plus, RefreshCcw, Trash2 } from 'lucide-react'

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
  useAttendanceQuery,
  useRemoveAttendanceMutation,
} from '@/hooks/attendance'
import { useEmployeesQuery } from '@/hooks/employees'
import { cn } from '@/lib/utils'
import type { Attendance } from '@/services/attendance/attendance.types'
import { AttendanceFormModal } from './components/attendance-form-modal'
import { AttendanceSituationBadge } from './components/attendance-situation-badge'
import { AttendanceDeleteDialog } from './components/attendance-delete-dialog'

function formatDate(value?: string | null) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function emptyValue(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '-'

  return value
}

export function ListAttendance() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAttendance, setEditingAttendance] =
    useState<Attendance | null>(null)
  const [deletingAttendance, setDeletingAttendance] =
    useState<Attendance | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { mutateAsync: removeAttendance, isPending: isRemoving } =
    useRemoveAttendanceMutation()

  const { data, isLoading, isError, refetch, isFetching } = useAttendanceQuery({
    page,
    limit,
  })
  const { data: employeesData } = useEmployeesQuery({ page: 1, limit: 100 })

  const employeesById = useMemo(() => {
    const map = new Map<number, string>()

    employeesData?.data.forEach((employee) => {
      map.set(employee.id, employee.name)
    })

    return map
  }, [employeesData])

  const attendanceRecords = data?.data ?? []
  const meta = data?.meta
  const total = meta?.total ?? 0
  const totalPages = meta?.totalPages ?? 1
  const currentPage = meta?.page ?? page
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const rangeEnd = Math.min(currentPage * limit, total)
  const loading = isLoading || isFetching

  function openCreateModal() {
    setEditingAttendance(null)
    setIsModalOpen(true)
  }

  function openEditModal(attendance: Attendance) {
    setEditingAttendance(attendance)
    setIsModalOpen(true)
  }

  function openDeleteDialog(attendance: Attendance) {
    setDeletingAttendance(attendance)
    setIsDeleteDialogOpen(true)
  }

  async function handleConfirmRemove() {
    if (!deletingAttendance) return

    await removeAttendance(String(deletingAttendance.id))
    setIsDeleteDialogOpen(false)
    setDeletingAttendance(null)
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
                <BreadcrumbPage>Assiduidade</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">Assiduidade</h1>
          <p className="text-muted-foreground">
            Consultar e registrar assiduidades de colaboradores
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
            Registrar Assiduidade
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
                <TableHead>Data de início</TableHead>
                <TableHead>Data de fim</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead>Criado em</TableHead>
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
                      <CalendarCheck className="h-8 w-8 text-destructive" />
                      <span className="font-medium text-destructive">
                        Erro ao carregar assiduidades
                      </span>
                      <span className="text-sm">
                        Não foi possível buscar os dados. Tente novamente mais
                        tarde.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : attendanceRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <CalendarCheck className="h-8 w-8" />
                      <span>Nenhuma assiduidade encontrada.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                attendanceRecords.map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell>{attendance.id}</TableCell>
                    <TableCell className="font-medium">
                      {employeesById.get(attendance.employeeId) ??
                        `Colaborador #${attendance.employeeId}`}
                    </TableCell>
                    <TableCell>{formatDate(attendance.startDate)}</TableCell>
                    <TableCell>{formatDate(attendance.endDate)}</TableCell>
                    <TableCell>{emptyValue(attendance.hours)}</TableCell>
                    <TableCell>
                      <AttendanceSituationBadge
                        situation={attendance.situation}
                      />
                    </TableCell>
                    <TableCell>{formatDate(attendance.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(attendance)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar assiduidade</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isRemoving}
                              onClick={() => openDeleteDialog(attendance)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remover assiduidade</TooltipContent>
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

      <AttendanceFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        attendance={editingAttendance}
      />

      <AttendanceDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open)

          if (!open) {
            setDeletingAttendance(null)
          }
        }}
        attendance={deletingAttendance}
        employeeName={
          deletingAttendance
            ? employeesById.get(deletingAttendance.employeeId)
            : undefined
        }
        loading={isRemoving}
        onConfirm={handleConfirmRemove}
      />
    </div>
  )
}
