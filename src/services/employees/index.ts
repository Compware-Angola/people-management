import { gpApi } from '@/lib/api/gp.api'
import type {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  EmployeeListParams,
  EmployeeListResponse,
  EmployeeResponse,
} from './employees.types'

async function create(payload: CreateEmployeeDTO): Promise<EmployeeResponse | void> {
  const response = await gpApi.post('employees', { json: payload })
  if (response.status === 204) {
    return
  }
  return response.json<EmployeeResponse>()
}
async function update(
  id: string,
  payload: UpdateEmployeeDTO,
): Promise<EmployeeResponse> {
  const response= await gpApi
    .patch(`employees/${id}`, { json: payload })
    if (response.status === 204) {
    return
  }
   return response.json<EmployeeResponse>()
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

export const employeesService = {
  create,
  update,
  findAll,
}