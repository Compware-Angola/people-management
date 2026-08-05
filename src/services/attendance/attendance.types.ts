export type AttendanceSituation =
  | 'PRESENTE'
  | 'FALTA'
  | 'LICENCA'
  | 'FERIAS'
  | 'ATRASO'

export type Attendance = {
  id: number
  employeeId: number
  startDate: string
  endDate?: string | null
  hours?: number | null
  situation: AttendanceSituation
  createdAt: string
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type AttendanceListResponse = {
  data: Attendance[]
  meta: PaginationMeta
}

export type AttendanceListParams = {
  page?: number
  limit?: number
}

export type CreateAttendanceDTO = {
  employeeId: number
  startDate: string
  endDate?: string
  hours?: number
  situation: AttendanceSituation
}

export type UpdateAttendanceDTO = Partial<CreateAttendanceDTO>
