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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save, X } from 'lucide-react'
import type {
  BudgetAvailability,
  FinancialDecision,
  Requisition,
  RhDecision,
} from '@/services/requisitions/requisitions.types'

export type RequisitionAction = 'cancel' | 'rh' | 'financial'

type ActionPayload = {
  decision?: RhDecision | FinancialDecision
  justification?: string
  opinion?: string
  budgetAvailability?: BudgetAvailability
  authorizedQuantity?: number
  budgetExercise?: string
  observation?: string
}

type Props = {
  open: boolean
  action?: RequisitionAction | null
  requisition?: Requisition | null
  loading?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (payload: ActionPayload) => Promise<void>
}

const rhDecisionOptions: { label: string; value: RhDecision }[] = [
  { label: 'Aprovar', value: 'APROVAR' },
  { label: 'Rejeitar', value: 'REJEITAR' },
]

const financialDecisionOptions: { label: string; value: FinancialDecision }[] =
  [
    { label: 'Aprovar', value: 'APROVAR' },
    { label: 'Aprovar parcialmente', value: 'APROVAR_PARCIALMENTE' },
    { label: 'Rejeitar', value: 'REJEITAR' },
  ]

const budgetOptions: { label: string; value: BudgetAvailability }[] = [
  { label: 'Disponível', value: 'Disponível' },
  { label: 'Parcialmente disponível', value: 'Parcialmente disponível' },
  { label: 'Indisponível', value: 'Indisponível' },
]

function getActionTitle(action?: RequisitionAction | null) {
  if (action === 'cancel') return 'Cancelar Requisição'
  if (action === 'rh') return 'Análise do RH'
  if (action === 'financial') return 'Análise Financeira'
  return 'Ação da Requisição'
}

export function RequisitionActionDialog({
  open,
  action,
  requisition,
  loading = false,
  onOpenChange,
  onConfirm,
}: Props) {
  const [decision, setDecision] = useState<string>('')
  const [budgetAvailability, setBudgetAvailability] = useState<string>('')
  const [authorizedQuantity, setAuthorizedQuantity] = useState('')
  const [budgetExercise, setBudgetExercise] = useState('')
  const [justification, setJustification] = useState('')
  const [opinion, setOpinion] = useState('')
  const [observation, setObservation] = useState('')

  useEffect(() => {
    if (!open) return

    setDecision(action === 'financial' || action === 'rh' ? 'APROVAR' : '')
    setBudgetAvailability(action === 'financial' ? 'Disponível' : '')
    setAuthorizedQuantity('')
    setBudgetExercise('')
    setJustification('')
    setOpinion('')
    setObservation('')
  }, [open, action])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await onConfirm({
      ...(decision ? { decision: decision as RhDecision | FinancialDecision } : {}),
      ...(justification ? { justification } : {}),
      ...(opinion ? { opinion } : {}),
      ...(budgetAvailability
        ? { budgetAvailability: budgetAvailability as BudgetAvailability }
        : {}),
      ...(authorizedQuantity
        ? { authorizedQuantity: Number(authorizedQuantity) }
        : {}),
      ...(budgetExercise ? { budgetExercise } : {}),
      ...(observation ? { observation } : {}),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>{getActionTitle(action)}</DialogTitle>
          <DialogDescription>
            {requisition
              ? `${requisition.requisitionCode} - ${requisition.position.description}`
              : 'Nenhuma requisição selecionada.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {action === 'rh' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Decisão</label>
                <Select value={decision} onValueChange={setDecision}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar decisão" />
                  </SelectTrigger>
                  <SelectContent>
                    {rhDecisionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Parecer</label>
                <Textarea
                  value={opinion}
                  onChange={(event) => setOpinion(event.target.value)}
                  placeholder="Parecer do RH"
                />
              </div>
            </>
          )}

          {action === 'financial' && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Decisão</label>
                  <Select value={decision} onValueChange={setDecision}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar decisão" />
                    </SelectTrigger>
                    <SelectContent>
                      {financialDecisionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Disponibilidade orçamentária
                  </label>
                  <Select
                    value={budgetAvailability}
                    onValueChange={setBudgetAvailability}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar disponibilidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Quantidade autorizada
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={authorizedQuantity}
                    onChange={(event) =>
                      setAuthorizedQuantity(event.target.value)
                    }
                    placeholder="Obrigatório se for parcial"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Exercício orçamental
                  </label>
                  <Input
                    value={budgetExercise}
                    onChange={(event) => setBudgetExercise(event.target.value)}
                    placeholder="Ex: 2026"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Parecer</label>
                <Textarea
                  value={opinion}
                  onChange={(event) => setOpinion(event.target.value)}
                  placeholder="Parecer financeiro"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Observação</label>
                <Textarea
                  value={observation}
                  onChange={(event) => setObservation(event.target.value)}
                  placeholder="Observações complementares"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {action === 'cancel' ? 'Justificativa' : 'Justificativa'}
            </label>
            <Textarea
              required={action === 'cancel'}
              value={justification}
              onChange={(event) => setJustification(event.target.value)}
              placeholder={
                action === 'cancel'
                  ? 'Informe o motivo do cancelamento'
                  : 'Obrigatória em caso de rejeição'
              }
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

            <Button type="submit" disabled={loading || !requisition}>
              {loading ? <Loader2 className="animate-spin" /> : <Save />}
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
