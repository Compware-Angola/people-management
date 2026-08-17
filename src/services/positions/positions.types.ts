export type PositionStatus = 0 | 1

export type Position = {
  code: number
  description: string
  status: PositionStatus
  createdAt: string
  deletedAt?: string | null
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type PositionsListResponse = {
  data: Position[]
  meta: PaginationMeta
}

export type PositionsListParams = {
  page?: number
  limit?: number
  search?: string
  status?: PositionStatus
}

export type CreatePositionDTO = {
  description: string
  status?: PositionStatus
}

export type UpdatePositionDTO = Partial<CreatePositionDTO>
