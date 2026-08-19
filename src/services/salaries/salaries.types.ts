export type SalaryStatus = 0 | 1

export type RubricType = 'PROVENTO' | 'DESCONTO'

export type RubricValueType = 'PERCENTUAL' | 'FIXO' | 'HORA_EXTRA'

export type SalaryEmployeeStatus = 'ATIVA' | 'INATIVA'

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type Salary = {
  id: number
  position: string
  category: string
  description?: string | null
  baseSalary: number
  status: SalaryStatus
  createdAt: string
}

export type SalaryListResponse = {
  data: Salary[]
  meta: PaginationMeta
}

export type SalaryListParams = {
  page?: number
  limit?: number
  id?: number
  position?: string
  category?: string
}

export type CreateSalaryDTO = {
  position: string
  category: string
  description?: string
  baseSalary: number
}

export type UpdateSalaryDTO = Partial<CreateSalaryDTO> & {
  status?: SalaryStatus
}

export type SalaryEmployee = {
  salaryId: number
  employeeId: number
  createdByEmployeeId: number
  status: SalaryEmployeeStatus
  startDate: string
  endDate?: string | null
  salaryStructure?: Salary
}

export type CreateSalaryEmployeeDTO = {
  salaryId: number
  employeeId: number
}

export type Rubric = {
  code: number
  description: string
  type: RubricType
  valueType: RubricValueType
  value: number
  status: SalaryStatus
  createdAt?: string | null
}

export type CreateRubricDTO = {
  description: string
  type: RubricType
  valueType: RubricValueType
  value: number
  status?: SalaryStatus
}

export type CreateSalaryRubricDTO = {
  salaryStructureCode: number
  rubricCode: number
}

export type SalaryWithRubrics = Salary & {
  rubrics: Rubric[]
}
