import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { Requisition } from '@/services/requisitions/requisitions.types'
import { RequisitionStatusBadge } from './requisition-status-badge'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  requisition?: Requisition | null
}

function formatDate(value?: string | null) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function DetailItem({
  label,
  value,
}: {
  label: string
  value?: string | number | null
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || '-'}</p>
    </div>
  )
}

export function RequisitionDetailsModal({
  open,
  onOpenChange,
  requisition,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Requisição</DialogTitle>
          <DialogDescription>
            Dados principais e histórico do fluxo de aprovação.
          </DialogDescription>
        </DialogHeader>

        {!requisition ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma requisição selecionada.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <DetailItem label="Código" value={requisition.requisitionCode} />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Estado
                </p>
                <RequisitionStatusBadge
                  acronym={requisition.state.acronym}
                  description={requisition.state.description}
                />
              </div>
              <DetailItem
                label="Solicitante"
                value={requisition.requester.name}
              />
              <DetailItem
                label="Departamento"
                value={requisition.department.description}
              />
              <DetailItem
                label="Centro de custo"
                value={requisition.costCenter.description}
              />
              <DetailItem label="Cargo" value={requisition.position.description} />
              <DetailItem
                label="Tipo de contratação"
                value={`${requisition.hiringType.acronym} - ${requisition.hiringType.description}`}
              />
              <DetailItem label="Quantidade" value={requisition.quantity} />
              <DetailItem
                label="Quantidade autorizada"
                value={requisition.authorizedQuantity}
              />
              <DetailItem
                label="Criado em"
                value={formatDate(requisition.createdAt)}
              />
              <DetailItem
                label="Enviado em"
                value={formatDate(requisition.sentAt)}
              />
              <DetailItem
                label="Atualizado em"
                value={formatDate(requisition.updatedAt)}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Justificativa</p>
              <div className="rounded-md border bg-muted/40 p-3 text-sm">
                {requisition.justification}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-semibold">Histórico</p>

              {!requisition.history?.length ? (
                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                  Nenhum histórico disponível.
                </div>
              ) : (
                <div className="space-y-3">
                  {requisition.history.map((item) => (
                    <div
                      key={item.code}
                      className="rounded-md border bg-background p-3"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold">
                            {item.action}
                            {item.decision ? ` - ${item.decision}` : ''}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.responsible.name} em {formatDate(item.date)}
                          </p>
                        </div>
                        <RequisitionStatusBadge
                          acronym={item.state.acronym}
                          description={item.state.description}
                        />
                      </div>

                      {(item.opinion ||
                        item.observation ||
                        item.budgetAvailability ||
                        item.budgetExercise ||
                        item.authorizedQuantity) && (
                        <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                          <DetailItem label="Parecer" value={item.opinion} />
                          <DetailItem
                            label="Observação"
                            value={item.observation}
                          />
                          <DetailItem
                            label="Disponibilidade orçamentária"
                            value={item.budgetAvailability}
                          />
                          <DetailItem
                            label="Exercício orçamental"
                            value={item.budgetExercise}
                          />
                          <DetailItem
                            label="Quantidade autorizada"
                            value={item.authorizedQuantity}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
