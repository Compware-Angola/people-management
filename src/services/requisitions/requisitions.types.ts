export type RequisitionStateAcronym =
  | 'RASCUNHO'
  | 'AGUARDANDO_RH'
  | 'AGUARDANDO_FINANCEIRO'
  | 'APROVADA'
  | 'APROVADA_PARCIALMENTE'
  | 'REJEITADA'
  | 'CANCELADA'

export type RhDecision = 'APROVAR' | 'REJEITAR'

export type FinancialDecision =
  | 'APROVAR'
  | 'APROVAR_PARCIALMENTE'
  | 'REJEITAR'

export type BudgetAvailability =
  | 'Disponível'
  | 'Parcialmente disponível'
  | 'Indisponível'

export type RequisitionOption = {
  code: number
  description: string
}

export type RequisitionHiringType = RequisitionOption & {
  acronym: string
}

export type RequisitionVacancyRequestType = {
  id: number
  acronym: string
  description: string
}

export type RequisitionRequester = {
  id: number
  name: string
}

export type RequisitionState = {
  code: number
  acronym: RequisitionStateAcronym | string
  description: string
}

export type RequisitionHistory = {
  code: number
  action: string
  decision: string | null
  opinion: string | null
  budgetAvailability: BudgetAvailability | string | null
  authorizedQuantity: number | null
  budgetExercise: string | null
  observation: string | null
  date: string
  state: Pick<RequisitionState, 'acronym' | 'description'>
  responsible: RequisitionRequester
}

export type Requisition = {
  code: number
  requisitionCode: string
  department: RequisitionOption
  costCenter: RequisitionOption
  position: RequisitionOption
  quantity: number
  justification: string
  hiringType: RequisitionHiringType
  vacancyRequestType?: RequisitionVacancyRequestType
  requester: RequisitionRequester
  state: RequisitionState
  authorizedQuantity: number | null
  sentAt: string | null
  createdAt: string
  updatedAt: string | null
  history?: RequisitionHistory[]
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type RequisitionsListResponse = {
  data: Requisition[]
  meta: PaginationMeta
}

export type RequisitionsListParams = {
  page?: number
  limit?: number
  search?: string
  requesterName?: string
  requesterId?: number
  departmentId?: number
  costCenterId?: number
  positionId?: number
  hiringTypeId?: number
  vacancyRequestTypeId?: number
  stateId?: number
  startDate?: string
  endDate?: string
}

export type CreateRequisitionDTO = {
  departmentId: number
  costCenterId: number
  positionId: number
  quantity: number
  justification: string
  hiringTypeId: number
  vacancyRequestTypeId: number
}

export type UpdateRequisitionDTO = Partial<CreateRequisitionDTO>

export type CancelRequisitionDTO = {
  justification: string
}

export type AnalyzeRequisitionRhDTO = {
  decision: RhDecision
  justification?: string
  opinion?: string
}

export type AnalyzeRequisitionFinancialDTO = {
  decision: FinancialDecision
  budgetAvailability: BudgetAvailability
  authorizedQuantity?: number
  budgetExercise?: string
  justification?: string
  opinion?: string
  observation?: string
}
