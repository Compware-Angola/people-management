export type VacancyStateAcronym =
  | 'RASCUNHO'
  | 'AGENDADA'
  | 'PUBLICADA'
  | 'SUSPENSA'
  | 'ENCERRADA'
  | 'CANCELADA'

export type VacancyState = {
  code: number
  acronym: VacancyStateAcronym | string
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

export type VacancyStatesListResponse = {
  data: VacancyState[]
  meta: PaginationMeta
}

export type VacancyStatesListParams = {
  page?: number
  limit?: number
  search?: string
  acronym?: VacancyStateAcronym | string
  code?: number
}
