import type { Rubric, Salary } from '@/services/salaries/salaries.types'

export type SalaryProcessingStatus =
  | 'PENDENTE'
  | 'SIMULADO'
  | 'FECHADO'
  | 'RECUSADO'
  | 'CANCELADO'

export type SalaryProcessingValidationStatus = 'FECHADO' | 'RECUSADO'

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type SalaryProcessing = {
  id: number
  startDate: string
  endDate: string
  status: SalaryProcessingStatus
  responsibleEmployeeId: number
  responsibleEmployeeName?: string | null
  validatorEmployeeId?: number | null
  validatorEmployeeName?: string | null
  validatedAt?: string | null
  originProcessingId?: number | null
  createdAt: string
  skippedEmployees?: string | null
}

export type SalaryProcessingRubricLine = {
  rubric: Rubric
  value: number
}

export type SalaryProcessingEmployeeTotal = {
  employeeId: number
  employeeName?: string | null
  salaryValue: number | null
  workedHours: number | null
  overtimeHours: number | null
  grossTotal: number
  discountTotal: number
  netTotal: number
  rubrics: SalaryProcessingRubricLine[]
}

export type SalaryProcessingSkippedEmployee = {
  employeeId: number
  employeeName?: string | null
  reason: string
}

export type SalaryProcessingDetails = SalaryProcessing & {
  skippedEmployees: SalaryProcessingSkippedEmployee[]
  employees: SalaryProcessingEmployeeTotal[]
}

export type SalaryProcessingListResponse = {
  data: SalaryProcessing[]
  meta: PaginationMeta
}

export type SalaryProcessingListParams = {
  page?: number
  limit?: number
  id?: number
  status?: SalaryProcessingStatus
  responsibleEmployeeId?: number
  startDate?: string
  endDate?: string
}

export type CreateSalaryProcessingDTO = {
  startDate: string
  endDate: string
}

export type ValidateSalaryProcessingDTO = {
  status: SalaryProcessingValidationStatus
}

export type SalaryProcessingEmployeeLine = {
  processingId: number
  employeeId: number
  salaryId: number
  rubricCode: number
  value: number
  workedHours?: number | null
  overtimeHours?: number | null
  salaryStructure?: Salary
  rubric?: Rubric
}
