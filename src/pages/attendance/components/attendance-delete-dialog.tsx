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
import type { Attendance } from '@/services/attendance/attendance.types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  attendance?: Attendance | null
  employeeName?: string
  loading?: boolean
  onConfirm: () => Promise<void>
}

export function AttendanceDeleteDialog({
  open,
  onOpenChange,
  attendance,
  employeeName,
  loading = false,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remover Assiduidade</DialogTitle>
          <DialogDescription>
            Esta ação vai remover o registro de assiduidade selecionado.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-3 text-sm">
          <p className="font-medium">
            {employeeName ?? `Colaborador #${attendance?.employeeId ?? '-'}`}
          </p>
          <p className="text-muted-foreground">
            Registro #{attendance?.id ?? '-'}
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
            disabled={loading || !attendance}
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
