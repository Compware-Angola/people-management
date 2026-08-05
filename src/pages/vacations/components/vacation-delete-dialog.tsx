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
import type { Vacation } from '@/services/vacations/vacations.types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vacation?: Vacation | null
  loading?: boolean
  onConfirm: () => Promise<void>
}

export function VacationDeleteDialog({
  open,
  onOpenChange,
  vacation,
  loading = false,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remover Férias</DialogTitle>
          <DialogDescription>
            Esta ação vai remover o registro de férias selecionado.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-3 text-sm">
          <p className="font-medium">
            {vacation?.employeeName ??
              `Colaborador #${vacation?.employeeId ?? '-'}`}
          </p>
          <p className="text-muted-foreground">
            Registro #{vacation?.id ?? '-'}
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
            disabled={loading || !vacation}
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
