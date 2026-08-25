import { Loader2, ShieldCheck, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useUserPermissionGroupsQuery } from '@/hooks/permissions'
import type { User } from '@/services/users/users.types'
import { PermissionGroupStatusBadge } from '@/pages/permission-groups/components/permission-group-status-badge'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

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

export function UserGroupsModal({ open, onOpenChange, user }: Props) {
  const { data: groups = [], isLoading, isError, isFetching } =
    useUserPermissionGroupsQuery(open ? user?.id : undefined)
  const loading = isLoading || isFetching

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Grupos do Utilizador</DialogTitle>
          <DialogDescription>
            {user
              ? `Grupos associados a ${user.name}.`
              : 'Grupos associados ao utilizador selecionado.'}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-3 text-sm">
          <p className="font-medium">{user?.name ?? 'Utilizador'}</p>
          <p className="text-muted-foreground">
            Código #{user?.id ?? '-'} · {user?.email ?? '-'}
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Carregando grupos...
                    </div>
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ShieldCheck className="h-7 w-7 text-destructive" />
                      <span className="font-medium text-destructive">
                        Erro ao carregar grupos do utilizador
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ShieldCheck className="h-7 w-7" />
                      <span>Este utilizador não pertence a nenhum grupo.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.id}</TableCell>
                    <TableCell className="font-medium">
                      {group.description}
                    </TableCell>
                    <TableCell>
                      {group.department?.description ?? 'Sem departamento'}
                    </TableCell>
                    <TableCell>
                      <PermissionGroupStatusBadge status={group.status} />
                    </TableCell>
                    <TableCell>{formatDate(group.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            <X className="mr-2 h-4 w-4" />
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
