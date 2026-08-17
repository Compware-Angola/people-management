import { useEffect, useMemo, useState } from 'react'
import { Check, KeyRound, Loader2, Save, Search, X } from 'lucide-react'

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
  useAssignPermissionsToGroupMutation,
  usePermissionGroupDetailsQuery,
  usePermissionsQuery,
} from '@/hooks/permissions'
import { cn } from '@/lib/utils'
import type {
  Permission,
  PermissionGroup,
} from '@/services/permissions/permissions.types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  group?: PermissionGroup | null
}

function isPermissionSelected(permissionId: number, selectedIds: number[]) {
  return selectedIds.includes(permissionId)
}

export function GroupPermissionsModal({ open, onOpenChange, group }: Props) {
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const { data: groupDetails, isLoading: isLoadingGroupDetails } =
    usePermissionGroupDetailsQuery(open ? group?.id : undefined)
  const { data: permissions = [], isLoading: isLoadingPermissions } =
    usePermissionsQuery()
  const { mutateAsync: assignPermissions, isPending: isSaving } =
    useAssignPermissionsToGroupMutation()

  useEffect(() => {
    if (!open) return

    setSelectedIds(
      groupDetails?.permissions?.map((permission) => permission.id) ?? [],
    )
  }, [open, groupDetails])

  const filteredPermissions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return permissions.filter((permission) => {
      if (permission.status !== 1) return false

      if (!normalizedSearch) return true

      return permission.description.toLowerCase().includes(normalizedSearch)
    })
  }, [permissions, search])

  const loading = isLoadingGroupDetails || isLoadingPermissions

  function togglePermission(permission: Permission) {
    setSelectedIds((current) => {
      if (isPermissionSelected(permission.id, current)) {
        return current.filter((id) => id !== permission.id)
      }

      return [...current, permission.id]
    })
  }

  async function handleSave() {
    if (!group) return

    await assignPermissions({
      groupId: group.id,
      data: {
        permissionIds: selectedIds,
      },
    })

    onOpenChange(false)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSearch('')
      setSelectedIds([])
    }

    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Permissões do Grupo</DialogTitle>
          <DialogDescription>
            Selecione as permissões que devem pertencer ao grupo.
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
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar permissão"
            className="pl-9"
          />
        </div>

        <div className="max-h-96 overflow-y-auto rounded-lg border">
          {loading ? (
            <div className="flex h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando permissões...
            </div>
          ) : filteredPermissions.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <KeyRound className="h-7 w-7" />
              Nenhuma permissão encontrada.
            </div>
          ) : (
            <div className="divide-y">
              {filteredPermissions.map((permission) => {
                const selected = isPermissionSelected(
                  permission.id,
                  selectedIds,
                )

                return (
                  <button
                    key={permission.id}
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted',
                      selected && 'bg-primary/5',
                    )}
                    onClick={() => togglePermission(permission)}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {permission.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Código #{permission.id}
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

        <div className="text-sm text-muted-foreground">
          {selectedIds.length} permissões selecionadas
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
            Guardar permissões
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
