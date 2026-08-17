import { useEffect, useMemo, useState } from 'react'
import { Check, Loader2, Save, Search, UserRoundPlus, X } from 'lucide-react'

import { Pagination } from '@/components/table/pagination'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  useAssignUsersToGroupMutation,
  usePermissionGroupDetailsQuery,
} from '@/hooks/permissions'
import { useUsersQuery } from '@/hooks/users'
import { cn } from '@/lib/utils'
import type { PermissionGroup } from '@/services/permissions/permissions.types'
import type { User } from '@/services/users/users.types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  group?: PermissionGroup | null
}

function isUserSelected(userId: number, selectedIds: number[]) {
  return selectedIds.includes(userId)
}

export function GroupUsersModal({ open, onOpenChange, group }: Props) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [newSelectedIds, setNewSelectedIds] = useState<number[]>([])
  const { data: groupDetails, isLoading: isLoadingGroupDetails } =
    usePermissionGroupDetailsQuery(open ? group?.id : undefined)
  const { data: usersData, isLoading: isLoadingUsers, isFetching } =
    useUsersQuery({
      page,
      limit,
      ...(search ? { name: search } : {}),
    })
  const { mutateAsync: assignUsers, isPending: isSaving } =
    useAssignUsersToGroupMutation()

  const users = useMemo(() => usersData?.data ?? [], [usersData])
  const currentUserIds = useMemo(
    () => groupDetails?.users?.map((user) => user.id) ?? [],
    [groupDetails],
  )
  const availableUsers = useMemo(
    () => users.filter((user) => !currentUserIds.includes(user.id)),
    [users, currentUserIds],
  )
  const meta = usersData?.meta
  const total = meta?.total ?? 0
  const totalPages = meta?.totalPages ?? 1
  const currentPage = meta?.page ?? page
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const rangeEnd = Math.min(currentPage * limit, total)
  const loading = isLoadingGroupDetails || isLoadingUsers || isFetching

  function toggleUser(user: User) {
    setNewSelectedIds((current) => {
      if (isUserSelected(user.id, current)) {
        return current.filter((id) => id !== user.id)
      }

      return [...current, user.id]
    })
  }

  async function handleSave() {
    if (!group) return

    await assignUsers({
      groupId: group.id,
      data: {
        userIds: Array.from(new Set([...currentUserIds, ...newSelectedIds])),
      },
    })

    onOpenChange(false)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSearch('')
      setPage(1)
      setNewSelectedIds([])
    }

    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Usuários do Grupo</DialogTitle>
          <DialogDescription>
            Selecione os usuários que devem pertencer ao grupo.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-3 text-sm">
          <p className="font-medium">{group?.description ?? 'Grupo'}</p>
          <p className="text-muted-foreground">Código #{group?.id ?? '-'}</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Pesquisar usuário por nome"
            className="pl-9"
          />
        </div>

        <div className="max-h-96 overflow-y-auto rounded-lg border">
          {loading ? (
            <div className="flex h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando usuários...
            </div>
          ) : availableUsers.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <UserRoundPlus className="h-7 w-7" />
              Nenhum usuário disponível para adicionar.
            </div>
          ) : (
            <div className="divide-y">
              {availableUsers.map((user) => {
                const selected = isUserSelected(user.id, newSelectedIds)

                return (
                  <button
                    key={user.id}
                    type="button"
                    className={cn(
                      'grid w-full grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted',
                      selected && 'bg-primary/5',
                    )}
                    onClick={() => toggleUser(user)}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email} · Código #{user.id}
                      </p>
                    </div>

                    <span
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded border',
                        selected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground/40',
                      )}
                    >
                      {selected && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          total={total}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          limit={limit}
          loading={loading}
          onPageChange={setPage}
          onLimitChange={(value) => {
            setLimit(value)
            setPage(1)
          }}
        />

        <div className="text-sm text-muted-foreground">
          {currentUserIds.length} usuários já associados ·{' '}
          {newSelectedIds.length} novos selecionados
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => handleOpenChange(false)}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>

          <Button
            type="button"
            disabled={isSaving || !group}
            onClick={handleSave}
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
            Guardar usuários
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
