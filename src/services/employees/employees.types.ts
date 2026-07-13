export type Employee = {
  id: number
  name: string
  bi: string
  nif: string
  phone: string
  alternativePhone: string
  province: string
  municipality: string
  address: string
  email: string
  bank: string
  iban: string
  accountHolder: string
  currency: string
  status: number
  createdAt: string
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type EmployeeListResponse = {
  data: Employee[]
  meta: PaginationMeta
}

export type EmployeeListParams = {
  page?: number
  limit?: number
}

export type CreateEmployeeDTO = Omit<Employee, 'createdAt' | "id">
export type UpdateEmployeeDTO = Partial<CreateEmployeeDTO>

export type EmployeeResponse = void
