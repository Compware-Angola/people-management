export type CostCenterStatus = 0 | 1

export type CostCenterDepartment = {
  code: number
  description: string
  status?: CostCenterStatus
}

export type CostCenter = {
  code: number
  departmentId: number
  department?: CostCenterDepartment
  description: string
  status: CostCenterStatus
  createdAt: string
  deletedAt?: string | null
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type CostCentersListResponse = {
  data: CostCenter[]
  meta: PaginationMeta
}

export type CostCentersListParams = {
  page?: number
  limit?: number
  search?: string
  departmentId?: number
  status?: CostCenterStatus
}

export type CreateCostCenterDTO = {
  departmentId: number
  description: string
  status?: CostCenterStatus
}

export type UpdateCostCenterDTO = Partial<CreateCostCenterDTO>
