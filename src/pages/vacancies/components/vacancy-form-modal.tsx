import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Save, X } from 'lucide-react'
import { useRequisitionStatesQuery } from '@/hooks/requisition-states'
import { useRequisitionsQuery } from '@/hooks/requisitions'
import {
  useCreateVacancyMutation,
  useUpdateVacancyMutation,
} from '@/hooks/vacancies'
import type {
  CreateVacancyDTO,
  Vacancy,
} from '@/services/vacancies/vacancies.types'
import {
  useVacancyFormModal,
  type VacancyFormValues,
} from '../hooks/use-vacancy-form-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vacancy?: Vacancy | null
}

function buildPayload(values: VacancyFormValues): CreateVacancyDTO {
  return {
    requisitionId: Number(values.requisitionId),
    ...(values.numberOfVacancies
      ? { numberOfVacancies: Number(values.numberOfVacancies) }
      : {}),
    ...(values.publicationDate
      ? { publicationDate: values.publicationDate }
      : {}),
    ...(values.closingDate ? { closingDate: values.closingDate } : {}),
  }
}

export function VacancyFormModal({ open, onOpenChange, vacancy }: Props) {
  const isEdit = Boolean(vacancy)
  const { mutateAsync: createVacancy } = useCreateVacancyMutation()
  const { mutateAsync: updateVacancy } = useUpdateVacancyMutation()
  const { data: requisitionStatesData } = useRequisitionStatesQuery({
    page: 1,
    limit: 100,
  })

  const approvedStateIds =
    requisitionStatesData?.data
      .filter((state) =>
        ['APROVADA', 'APROVADA_PARCIALMENTE'].includes(state.acronym),
      )
      .map((state) => state.code) ?? []

  const { data: requisitionsData, isLoading: isLoadingRequisitions } =
    useRequisitionsQuery({
      page: 1,
      limit: 100,
    })

  const requisitionOptions =
    requisitionsData?.data
      .filter((requisition) =>
        approvedStateIds.includes(requisition.state.code),
      )
      .map((requisition) => ({
        label: `${requisition.requisitionCode} - ${requisition.position.description} (${requisition.department.description})`,
        value: String(requisition.code),
      })) ?? []

  const { form, canSubmit, isLoading } = useVacancyFormModal({
    open,
    vacancy,
    onSave: async (values) => {
      const payload = buildPayload(values)

      if (vacancy) {
        const { requisitionId: _requisitionId, ...updatePayload } = payload
        await updateVacancy({
          code: vacancy.vacancyCode,
          data: updatePayload,
        })
      } else {
        await createVacancy(payload)
      }

      onOpenChange(false)
    },
  })

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset()
    }

    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Vaga' : 'Nova Vaga'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os dados permitidos antes da publicação.'
              : 'Crie uma vaga a partir de uma requisição aprovada.'}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <form.AppField name="requisitionId">
              {(field) => (
                <field.ComboboxField
                  label="Requisição aprovada"
                  disabled={isEdit}
                  placeholder={
                    isLoadingRequisitions
                      ? 'Carregando requisições...'
                      : 'Selecionar requisição'
                  }
                  emptyMessage="Nenhuma requisição aprovada encontrada."
                  options={requisitionOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="numberOfVacancies">
              {(field) => (
                <field.TextField
                  label="Número de vagas"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ex: 2"
                />
              )}
            </form.AppField>

            <form.AppField name="publicationDate">
              {(field) => (
                <field.TextField label="Data de publicação" type="date" />
              )}
            </form.AppField>

            <form.AppField name="closingDate">
              {(field) => (
                <field.TextField label="Data de encerramento" type="date" />
              )}
            </form.AppField>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => handleOpenChange(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>

            <Button type="submit" disabled={!canSubmit || isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
