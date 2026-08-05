export type LeaveType = 'MEDICA' | 'MATERNIDADE' | 'PATERNIDADE' | 'ESTUDO'

export type LeaveStatus = 'PENDENTE' | 'APROVADA' | 'REJEITADA' | 'CANCELADA'

export type Leave = {
  id: number
  employeeId: number
  approverId?: number | null
  type: LeaveType
  status: LeaveStatus
  startDate: string
  endDate: string
  documentId?: number | null
  observation?: string | null
  createdAt: string
  updatedAt?: string | null
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type LeaveListResponse = {
  data: Leave[]
  meta: PaginationMeta
}

export type LeaveListParams = {
  page?: number
  limit?: number
  employeeId?: number
  type?: LeaveType
  status?: LeaveStatus
  startDate?: string
  endDate?: string
}

export type CreateLeaveDTO = {
  employeeId: number
  type: LeaveType
  startDate: string
  endDate: string
  documentId?: number
  observation?: string
}

export type UpdateLeaveDTO = {
  status: LeaveStatus
  observation?: string
}
