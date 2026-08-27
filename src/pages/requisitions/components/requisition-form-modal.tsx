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
import { useMyDepartmentsQuery } from '@/hooks/departments'
import { useCostCentersQuery } from '@/hooks/cost-centers'
import { useHiringTypesQuery } from '@/hooks/hiring-types'
import { usePositionsQuery } from '@/hooks/positions'
import { useVacancyRequestTypesQuery } from '@/hooks/vacancy-request-types'
import {
  useCreateRequisitionMutation,
  useUpdateRequisitionMutation,
} from '@/hooks/requisitions'
import type {
  CreateRequisitionDTO,
  Requisition,
} from '@/services/requisitions/requisitions.types'
import {
  useRequisitionFormModal,
  type RequisitionFormValues,
} from '../hooks/use-requisition-form-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  requisition?: Requisition | null
}

function buildPayload(values: RequisitionFormValues): CreateRequisitionDTO {
  const payload: CreateRequisitionDTO = {
    departmentId: Number(values.departmentId),
    costCenterId: Number(values.costCenterId),
    positionId: Number(values.positionId),
    hiringTypeId: Number(values.hiringTypeId),
    vacancyRequestTypeId: Number(values.vacancyRequestTypeId),
    quantity: Number(values.quantity),
    justification: values.justification,
  }

  if (!values.vacancyRequestTypeId) {
    delete (payload as Partial<CreateRequisitionDTO>).vacancyRequestTypeId
  }

  return payload
}

export function RequisitionFormModal({
  open,
  onOpenChange,
  requisition,
}: Props) {
  const isEdit = Boolean(requisition)
  const { mutateAsync: createRequisition } = useCreateRequisitionMutation()
  const { mutateAsync: updateRequisition } = useUpdateRequisitionMutation()
  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useMyDepartmentsQuery()
  const { data: costCentersData, isLoading: isLoadingCostCenters } =
    useCostCentersQuery({ page: 1, limit: 100, status: 1 })
  const { data: positionsData, isLoading: isLoadingPositions } =
    usePositionsQuery({ page: 1, limit: 100, status: 1 })
  const { data: hiringTypesData, isLoading: isLoadingHiringTypes } =
    useHiringTypesQuery({ page: 1, limit: 100, status: 1 })
  const {
    data: vacancyRequestTypesData,
    isLoading: isLoadingVacancyRequestTypes,
  } = useVacancyRequestTypesQuery({ page: 1, limit: 100, status: 1 })

  const departmentOptions =
    departmentsData?.departments.map((department) => ({
      label: department.description,
      value: String(department.code),
    })) ?? []

  const costCenterOptions =
    costCentersData?.data.map((costCenter) => ({
      label: costCenter.department?.description
        ? `${costCenter.description} - ${costCenter.department.description}`
        : costCenter.description,
      value: String(costCenter.code),
    })) ?? []

  const positionOptions =
    positionsData?.data.map((position) => ({
      label: position.description,
      value: String(position.code),
    })) ?? []

  const hiringTypeOptions =
    hiringTypesData?.data.map((hiringType) => ({
      label: `${hiringType.acronym} - ${hiringType.description}`,
      value: String(hiringType.code),
    })) ?? []

  const vacancyRequestTypeOptions =
    vacancyRequestTypesData?.data.map((vacancyRequestType) => ({
      label: `${vacancyRequestType.acronym} - ${vacancyRequestType.description}`,
      value: String(vacancyRequestType.id),
    })) ?? []

  const { form, canSubmit, isLoading } = useRequisitionFormModal({
    open,
    requisition,
    onSave: async (values) => {
      const payload = buildPayload(values)

      try {
        if (requisition) {
          await updateRequisition({
            code: requisition.requisitionCode,
            data: payload,
          })
        } else {
          await createRequisition(payload)
        }

        onOpenChange(false)
      } catch {
        // A mutation ja apresenta a mensagem devolvida pela API.
        // Aqui apenas impedimos que o erro vire mensagem generica do formulario.
      }
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
      <DialogContent className="max-h-[90vh] max-w-4xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Requisição' : 'Nova Requisição'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os dados da requisição enquanto ela estiver em rascunho.'
              : 'Preencha os dados necessários para solicitar uma vaga.'}
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
            <form.AppField name="departmentId">
              {(field) => (
                <field.ComboboxField
                  label="Departamento"
                  placeholder={
                    isLoadingDepartments
                      ? 'Carregando departamentos...'
                      : 'Selecionar departamento'
                  }
                  emptyMessage="Nenhum departamento encontrado."
                  options={departmentOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="costCenterId">
              {(field) => (
                <field.ComboboxField
                  label="Centro de custo"
                  placeholder={
                    isLoadingCostCenters
                      ? 'Carregando centros de custo...'
                      : 'Selecionar centro de custo'
                  }
                  emptyMessage="Nenhum centro de custo encontrado."
                  options={costCenterOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="positionId">
              {(field) => (
                <field.ComboboxField
                  label="Cargo"
                  placeholder={
                    isLoadingPositions
                      ? 'Carregando cargos...'
                      : 'Selecionar cargo'
                  }
                  emptyMessage="Nenhum cargo encontrado."
                  options={positionOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="hiringTypeId">
              {(field) => (
                <field.ComboboxField
                  label="Tipo de contratação"
                  placeholder={
                    isLoadingHiringTypes
                      ? 'Carregando tipos de contratação...'
                      : 'Selecionar tipo de contratação'
                  }
                  emptyMessage="Nenhum tipo de contratação encontrado."
                  options={hiringTypeOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="vacancyRequestTypeId">
              {(field) => (
                <field.ComboboxField
                  label="Tipo de requisição"
                  placeholder={
                    isLoadingVacancyRequestTypes
                      ? 'Carregando tipos de requisição...'
                      : 'Selecionar tipo de requisição'
                  }
                  emptyMessage="Nenhum tipo de requisição encontrado."
                  options={vacancyRequestTypeOptions}
                />
              )}
            </form.AppField>

            <form.AppField name="quantity">
              {(field) => (
                <field.TextField
                  label="Quantidade"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ex: 2"
                />
              )}
            </form.AppField>
          </div>

          <form.AppField name="justification">
            {(field) => (
              <field.TextareaField
                label="Justificativa"
                placeholder="Descreva a necessidade desta requisição"
              />
            )}
          </form.AppField>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>

            <Button type="submit" disabled={!canSubmit || isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
              {isEdit ? 'Guardar alterações' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
