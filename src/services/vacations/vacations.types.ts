export type VacationStatus =
  | 'PENDENTE'
  | 'APROVADO'
  | 'REPROVADO'
  | 'CANCELADO'

export type Vacation = {
  id: number
  employeeId: number
  employeeName: string
  startDate: string
  endDate: string
  days: number
  observation?: string | null
  approverManagerId?: number | null
  approverManagerName?: string | null
  approverRhId?: number | null
  approverRhName?: string | null
  status: VacationStatus
  createdAt: string
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type VacationListResponse = {
  data: Vacation[]
  meta: PaginationMeta
}

export type VacationListParams = {
  page?: number
  limit?: number
  employeeId?: number
  status?: VacationStatus
  approverManagerId?: number
  approverRhId?: number
  startDate?: string
  endDate?: string
}

export type CreateVacationDTO = {
  employeeId: number
  startDate: string
  endDate: string
  days: number
  observation?: string
  approverManagerId?: number
  approverRhId?: number
  status?: VacationStatus
}

export type UpdateVacationDTO = Partial<CreateVacationDTO>
