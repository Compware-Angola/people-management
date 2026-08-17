export type RequisitionStateAcronym =
  | 'RASCUNHO'
  | 'AGUARDANDO_RH'
  | 'AGUARDANDO_FINANCEIRO'
  | 'APROVADA'
  | 'APROVADA_PARCIALMENTE'
  | 'REJEITADA'
  | 'CANCELADA'

export type RequisitionState = {
  code: number
  acronym: RequisitionStateAcronym | string
  description: string
  order: number
  createdAt: string
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type RequisitionStatesListResponse = {
  data: RequisitionState[]
  meta: PaginationMeta
}

export type RequisitionStatesListParams = {
  page?: number
  limit?: number
  search?: string
  acronym?: RequisitionStateAcronym | string
  code?: number
}
