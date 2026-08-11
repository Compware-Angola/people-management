export type DepartmentStatus = 0 | 1

export type Department = {
  code: number
  description: string
  status: DepartmentStatus
  createdAt: string
  deletedAt?: string | null
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type DepartmentsListResponse = {
  data: Department[]
  meta: PaginationMeta
}

export type DepartmentsListParams = {
  page?: number
  limit?: number
  search?: string
  status?: DepartmentStatus
}

export type CreateDepartmentDTO = {
  description: string
  status?: DepartmentStatus
}

export type UpdateDepartmentDTO = Partial<CreateDepartmentDTO>
