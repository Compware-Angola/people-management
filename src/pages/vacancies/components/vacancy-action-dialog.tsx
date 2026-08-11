import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, X } from 'lucide-react'
import type {
  Vacancy,
  VacancyActionDTO,
} from '@/services/vacancies/vacancies.types'

export type VacancyAction = 'publish' | 'suspend' | 'reactivate' | 'close' | 'cancel'

type Props = {
  open: boolean
  action?: VacancyAction | null
  vacancy?: Vacancy | null
  loading?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (payload: VacancyActionDTO) => Promise<void>
}

function getActionTitle(action?: VacancyAction | null) {
  if (action === 'publish') return 'Publicar Vaga'
  if (action === 'suspend') return 'Suspender Vaga'
  if (action === 'reactivate') return 'Reativar Vaga'
  if (action === 'close') return 'Encerrar Vaga'
  if (action === 'cancel') return 'Cancelar Vaga'
  return 'Ação da Vaga'
}

function requiresJustification(action?: VacancyAction | null) {
  return ['suspend', 'close', 'cancel'].includes(action ?? '')
}

export function VacancyActionDialog({
  open,
  action,
  vacancy,
  loading = false,
  onOpenChange,
  onConfirm,
}: Props) {
  const [justification, setJustification] = useState('')
  const [observation, setObservation] = useState('')

  useEffect(() => {
    if (!open) return

    setJustification('')
    setObservation('')
  }, [open, action])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await onConfirm({
      justification,
      ...(observation ? { observation } : {}),
    })
  }

  const justificationRequired = requiresJustification(action)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>{getActionTitle(action)}</DialogTitle>
          <DialogDescription>
            {vacancy
              ? `${vacancy.vacancyCode} - ${vacancy.position?.description ?? '-'}`
              : 'Nenhuma vaga selecionada.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {justificationRequired && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Justificativa</label>
              <Textarea
                value={justification}
                onChange={(event) => setJustification(event.target.value)}
                placeholder="Informe o motivo desta ação"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Observação</label>
            <Textarea
              value={observation}
              onChange={(event) => setObservation(event.target.value)}
              placeholder="Observação complementar"
            />
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
              type="submit"
              disabled={
                loading ||
                !vacancy ||
                (justificationRequired && !justification.trim())
              }
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save />}
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
