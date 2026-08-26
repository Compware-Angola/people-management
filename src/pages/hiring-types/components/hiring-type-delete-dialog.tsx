import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2, X } from 'lucide-react'
import type { HiringType } from '@/services/hiring-types/hiring-types.types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  hiringType?: HiringType | null
  loading?: boolean
  onConfirm: () => Promise<void>
}

export function HiringTypeDeleteDialog({
  open,
  onOpenChange,
  hiringType,
  loading = false,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remover Tipo de Contratação</DialogTitle>
          <DialogDescription>
            Esta ação vai remover o tipo de contratação selecionado.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-3 text-sm">
          <p className="font-medium">
            {hiringType?.description ?? 'Tipo de contratação não selecionado'}
          </p>
          <p className="text-muted-foreground">
            {hiringType?.acronym ?? '-'} · Código #{hiringType?.code ?? '-'}
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
            disabled={loading || !hiringType}
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
