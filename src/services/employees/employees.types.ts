export type Employee = {
  id: number
  userId?: number
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
  files?: EmployeeFile[]
}

export type EmployeeFileType =
  | 'BI'
  | 'NIF'
  | 'CONTRATO'
  | 'CURRICULO'
  | 'CERTIFICADO'
  | 'DIPLOMA'
  | 'DECLARACAO'
  | 'FOTO'
  | 'OUTRO'

export type EmployeeFile = {
  id: number
  type: EmployeeFileType
  originalName: string
  path: string
  description?: string | null
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

export type CreateEmployeeDTO = {
  userId: number
  bank: string
  iban: string
  accountHolder: string
  currency: string
  status?: number
}

export type UpdateEmployeeDTO = Partial<CreateEmployeeDTO>

export type CreateEmployeeFileDTO = {
  userId: number
  type: EmployeeFileType
  path: string
  originalName: string
  description?: string
}

export type EmployeeResponse = void
