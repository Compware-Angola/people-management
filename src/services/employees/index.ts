import { gpApi } from '@/lib/api/gp.api'
import type {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  CreateEmployeeFileDTO,
  Employee,
  EmployeeListParams,
  EmployeeListResponse,
  EmployeeResponse,
} from './employees.types'

async function parseOptionalJson<T>(response: Response): Promise<T | void> {
  if (response.status === 204) {
    return
  }

  const body = await response.text()

  if (!body) {
    return
  }

  return JSON.parse(body) as T
}

async function create(payload: CreateEmployeeDTO): Promise<EmployeeResponse | void> {
  const response = await gpApi.post('employees', { json: payload })

  return parseOptionalJson<EmployeeResponse>(response)
}
async function update(
  id: string,
  payload: UpdateEmployeeDTO,
): Promise<EmployeeResponse | void> {
  const response = await gpApi.patch(`employees/${id}`, { json: payload })

  return parseOptionalJson<EmployeeResponse>(response)
}

async function findAll(
  params?: EmployeeListParams,
): Promise<EmployeeListResponse> {
  return gpApi
    .get('employees', {
      searchParams: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
      },
    })
    .json<EmployeeListResponse>()
}

async function findOne(id: string): Promise<Employee> {
  return gpApi.get(`employees/${id}`).json<Employee>()
}

async function addFile(
  payload: CreateEmployeeFileDTO,
): Promise<EmployeeResponse | void> {
  const response = await gpApi.post('employees/files', { json: payload })

  return parseOptionalJson<EmployeeResponse>(response)
}

async function removeFile(id: string): Promise<void> {
  await gpApi.delete(`employees/files/${id}`)
}

export const employeesService = {
  create,
  update,
  findAll,
  findOne,
  addFile,
  removeFile,
}
