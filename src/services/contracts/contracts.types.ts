export type ContractType = 'CONTRATADO' | 'HORISTA' | 'FIXO'

export type ContractStatus = 'ATIVO' | 'INATIVO'

export type ContractEmployeeStatus = 'ATIVO' | 'INATIVO'

export type Contract = {
  id: number
  type: ContractType
  status: ContractStatus
  allowsOvertime: number
  monthlyHours: number
  createdAt: string
}

export type ContractEmployee = {
  id: number
  contractId: number
  employeeId: number
  status: ContractEmployeeStatus
  startDate: string
  endDate?: string | null
  contract?: Contract
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type ContractsListResponse = {
  data: Contract[]
  meta: PaginationMeta
}

export type ContractsListParams = {
  page?: number
  limit?: number
  id?: number
  type?: ContractType
  status?: ContractStatus
}

export type CreateContractDTO = {
  type: ContractType
  allowsOvertime?: number
  monthlyHours: number
}

export type UpdateContractDTO = {
  type?: ContractType
  status?: ContractStatus
  allowsOvertime?: number
  monthlyHours?: number
}

export type AssignContractToEmployeeDTO = {
  contractId: number
  employeeId: number
}
