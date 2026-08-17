import { Loader2, Trash2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Permission } from '@/services/permissions/permissions.types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  permission?: Permission | null
  loading?: boolean
  onConfirm: () => Promise<void>
}

export function PermissionDeleteDialog({
  open,
  onOpenChange,
  permission,
  loading = false,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remover Permissão</DialogTitle>
          <DialogDescription>
            Esta ação vai remover a permissão selecionada.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-3 text-sm">
          <p className="font-medium">
            {permission?.description ?? 'Permissão não selecionada'}
          </p>
          <p className="text-muted-foreground">
            Código #{permission?.id ?? '-'}
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={loading || !permission}
            onClick={onConfirm}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
            Remover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
