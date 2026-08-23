export type HiringTypeStatus = 0 | 1

export type HiringType = {
  code: number
  acronym: string
  description: string
  status: HiringTypeStatus
  createdAt: string
  deletedAt?: string | null
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type HiringTypesListResponse = {
  data: HiringType[]
  meta: PaginationMeta
}

export type HiringTypesListParams = {
  page?: number
  limit?: number
  search?: string
  acronym?: string
  status?: HiringTypeStatus
}

export type CreateHiringTypeDTO = {
  acronym: string
  description: string
  status?: HiringTypeStatus
}

export type UpdateHiringTypeDTO = Partial<CreateHiringTypeDTO>
