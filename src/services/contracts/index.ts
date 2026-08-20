import { gpApi } from '@/lib/api/gp.api'
import { buildSearchParams } from '@/lib/api/build-search-params'
import { parseOptionalJson } from '@/lib/api/parse-optional-json'
import type {
  AssignContractToEmployeeDTO,
  Contract,
  ContractEmployee,
  ContractsListParams,
  ContractsListResponse,
  CreateContractDTO,
  UpdateContractDTO,
} from './contracts.types'

async function create(payload: CreateContractDTO): Promise<Contract | void> {
  const response = await gpApi.post('contracts', { json: payload })

  return parseOptionalJson<Contract>(response)
}

async function findAll(
  params?: ContractsListParams,
): Promise<ContractsListResponse> {
  return gpApi
    .get('contracts', {
      searchParams: buildSearchParams({
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        id: params?.id,
        type: params?.type,
        status: params?.status,
      }),
    })
    .json<ContractsListResponse>()
}

async function update(
  id: number,
  payload: UpdateContractDTO,
): Promise<Contract | void> {
  const response = await gpApi.patch(`contracts/${id}`, { json: payload })

  return parseOptionalJson<Contract>(response)
}

async function assignToEmployee(
  payload: AssignContractToEmployeeDTO,
): Promise<ContractEmployee | void> {
  const response = await gpApi.post('contracts/employees', { json: payload })

  return parseOptionalJson<ContractEmployee>(response)
}

async function findEmployeeActiveContract(
  employeeId: number,
): Promise<ContractEmployee> {
  return gpApi
    .get(`contracts/employees/${employeeId}`)
    .json<ContractEmployee>()
}

async function findEmployeeContractHistory(
  employeeId: number,
): Promise<ContractEmployee[]> {
  return gpApi
    .get(`contracts/employees/${employeeId}/history`)
    .json<ContractEmployee[]>()
}

export const contractsService = {
  create,
  findAll,
  update,
  assignToEmployee,
  findEmployeeActiveContract,
  findEmployeeContractHistory,
}
