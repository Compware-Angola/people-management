import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { Vacancy } from '@/services/vacancies/vacancies.types'
import { VacancyStatusBadge } from './vacancy-status-badge'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vacancy?: Vacancy | null
}

function formatDate(value?: string | null, withTime = false) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date)
}

function userName(user?: { name?: string; nome?: string; email?: string }) {
  return user?.name || user?.nome || user?.email || '-'
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
      <p className="break-words text-sm font-medium">{value || '-'}</p>
    </div>
  )
}

export function VacancyDetailsModal({ open, onOpenChange, vacancy }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Vaga</DialogTitle>
          <DialogDescription>
            Dados principais, documentos e histórico da vaga.
          </DialogDescription>
        </DialogHeader>

        {!vacancy ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma vaga selecionada.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <DetailItem label="Código" value={vacancy.vacancyCode} />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Estado
                </p>
                <VacancyStatusBadge
                  acronym={vacancy.state?.acronym}
                  description={vacancy.state?.description}
                />
              </div>
              <DetailItem
                label="Requisição de origem"
                value={vacancy.requisition?.requisitionCode}
              />
              <DetailItem
                label="Cargo"
                value={vacancy.position?.description}
              />
              <DetailItem
                label="Departamento"
                value={vacancy.department?.description}
              />
              <DetailItem
                label="Tipo de contratação"
                value={
                  vacancy.hiringType
                    ? `${vacancy.hiringType.acronym} - ${vacancy.hiringType.description}`
                    : '-'
                }
              />
              <DetailItem
                label="Número de vagas"
                value={vacancy.numberOfVacancies}
              />
              <DetailItem
                label="Data de publicação"
                value={formatDate(vacancy.publicationDate)}
              />
              <DetailItem
                label="Data de encerramento"
                value={formatDate(vacancy.closingDate)}
              />
              <DetailItem
                label="Criado por"
                value={userName(vacancy.createdByUser)}
              />
              <DetailItem
                label="Criado em"
                value={formatDate(vacancy.createdAt, true)}
              />
              <DetailItem
                label="Atualizado em"
                value={formatDate(vacancy.updatedAt, true)}
              />
            </div>

            {vacancy.justification && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">Justificativa</p>
                <div className="rounded-md border bg-muted/40 p-3 text-sm">
                  {vacancy.justification}
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-semibold">Documentos</p>

              {!vacancy.documents?.length ? (
                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                  Nenhum documento anexado.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {vacancy.documents.map((document) => (
                    <div
                      key={document.code}
                      className="rounded-md border bg-background p-3"
                    >
                      <p className="break-words text-sm font-semibold">
                        {document.originalName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {document.type} - {formatDate(document.createdAt, true)}
                      </p>
                      {document.description && (
                        <p className="mt-2 break-words text-sm">
                          {document.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <p className="text-sm font-semibold">Histórico</p>

              {!vacancy.history?.length ? (
                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                  Nenhum histórico disponível.
                </div>
              ) : (
                <div className="space-y-3">
                  {vacancy.history.map((item) => (
                    <div
                      key={item.code}
                      className="rounded-md border bg-background p-3"
                    >
                      <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                        <p className="text-sm font-semibold">{item.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(item.date, true)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Responsável: {userName(item.responsible)}
                      </p>
                      {item.observation && (
                        <p className="mt-2 text-sm">{item.observation}</p>
                      )}
                      {item.justification && (
                        <p className="mt-2 text-sm">
                          <span className="font-medium">Justificativa:</span>{' '}
                          {item.justification}
                        </p>
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
