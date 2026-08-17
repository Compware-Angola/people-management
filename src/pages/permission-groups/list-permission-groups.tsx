import { useMemo, useState } from 'react'
import {
  KeyRound,
  Pencil,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react'

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
import { TableGroupRowSkeleton } from '@/components/table/table-skeleton'
import {
  usePermissionGroupsQuery,
  useRemovePermissionGroupMutation,
} from '@/hooks/permissions'
import { cn } from '@/lib/utils'
import type { PermissionGroup } from '@/services/permissions/permissions.types'
import { GroupPermissionsModal } from './components/group-permissions-modal'
import { GroupUsersModal } from './components/group-users-modal'
import { PermissionGroupDeleteDialog } from './components/permission-group-delete-dialog'
import { PermissionGroupFormModal } from './components/permission-group-form-modal'
import { PermissionGroupStatusBadge } from './components/permission-group-status-badge'

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

export function ListPermissionGroups() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<PermissionGroup | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<PermissionGroup | null>(
    null,
  )
  const [permissionsGroup, setPermissionsGroup] =
    useState<PermissionGroup | null>(null)
  const [usersGroup, setUsersGroup] = useState<PermissionGroup | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false)
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false)
  const { mutateAsync: removeGroup, isPending: isRemoving } =
    useRemovePermissionGroupMutation()

  const { data = [], isLoading, isError, refetch, isFetching } =
    usePermissionGroupsQuery()

  const filteredGroups = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return data.filter((group) => {
      const matchesSearch =
        !normalizedSearch ||
        group.description.toLowerCase().includes(normalizedSearch) ||
        group.department?.description
          ?.toLowerCase()
          .includes(normalizedSearch)

      const matchesStatus =
        status === 'all' || String(group.status) === status

      return matchesSearch && matchesStatus
    })
  }, [data, search, status])

  const loading = isLoading || isFetching

  function openCreateModal() {
    setEditingGroup(null)
    setIsModalOpen(true)
  }

  function openEditModal(group: PermissionGroup) {
    setEditingGroup(group)
    setIsModalOpen(true)
  }

  function openDeleteDialog(group: PermissionGroup) {
    setDeletingGroup(group)
    setIsDeleteDialogOpen(true)
  }

  function openPermissionsModal(group: PermissionGroup) {
    setPermissionsGroup(group)
    setIsPermissionsModalOpen(true)
  }

  function openUsersModal(group: PermissionGroup) {
    setUsersGroup(group)
    setIsUsersModalOpen(true)
  }

  async function handleConfirmRemove() {
    if (!deletingGroup) return

    await removeGroup(deletingGroup.id)
    setIsDeleteDialogOpen(false)
    setDeletingGroup(null)
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
                <BreadcrumbPage>Grupos de Permissão</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">
            Grupos de Permissão
          </h1>
          <p className="text-muted-foreground">
            Consultar, criar e editar grupos usados no controle de acessos
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
            Novo Grupo
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Grupo ou departamento</Label>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar por grupo ou departamento"
            />
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={status} onValueChange={setStatus}>
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
                <TableHead>Departamento</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableGroupRowSkeleton rows={10} columns={7} />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <ShieldCheck className="h-8 w-8 text-destructive" />
                      <span className="font-medium text-destructive">
                        Erro ao carregar grupos
                      </span>
                      <span className="text-sm">
                        Não foi possível buscar os dados. Tente novamente mais
                        tarde.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ShieldCheck className="h-8 w-8" />
                      <span>Nenhum grupo encontrado.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.id}</TableCell>
                    <TableCell className="font-medium">
                      {group.description}
                    </TableCell>
                    <TableCell>
                      {group.department?.description ?? 'Sem departamento'}
                    </TableCell>
                    <TableCell>{group.permissions?.length ?? 0}</TableCell>
                    <TableCell>
                      <PermissionGroupStatusBadge status={group.status} />
                    </TableCell>
                    <TableCell>{formatDate(group.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openPermissionsModal(group)}
                            >
                              <KeyRound className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Associar permissões</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openUsersModal(group)}
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Associar usuários</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(group)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar grupo</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isRemoving}
                              onClick={() => openDeleteDialog(group)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remover grupo</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <PermissionGroupFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        group={editingGroup}
      />

      <PermissionGroupDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        group={deletingGroup}
        loading={isRemoving}
        onConfirm={handleConfirmRemove}
      />

      <GroupPermissionsModal
        open={isPermissionsModalOpen}
        onOpenChange={setIsPermissionsModalOpen}
        group={permissionsGroup}
      />

      <GroupUsersModal
        open={isUsersModalOpen}
        onOpenChange={setIsUsersModalOpen}
        group={usersGroup}
      />
    </div>
  )
}
