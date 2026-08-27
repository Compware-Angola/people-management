export type VacancyRequestTypeStatus = 0 | 1

export type VacancyRequestType = {
  id: number
  acronym: string
  description: string
  status: VacancyRequestTypeStatus
  createdAt: string
  deletedAt?: string | null
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type VacancyRequestTypesListResponse = {
  data: VacancyRequestType[]
  meta: PaginationMeta
}

export type VacancyRequestTypesListParams = {
  page?: number
  limit?: number
  search?: string
  status?: VacancyRequestTypeStatus
}
