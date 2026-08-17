import { gpApi } from '@/lib/api/gp.api'
import { buildSearchParams } from '@/lib/api/build-search-params'
import { parseOptionalJson } from '@/lib/api/parse-optional-json'
import type {
  CreateDepartmentDTO,
  Department,
  DepartmentsListParams,
  DepartmentsListResponse,
  MyDepartmentsResponse,
  UpdateDepartmentDTO,
} from './departments.types'

async function create(
  payload: CreateDepartmentDTO,
): Promise<Department | void> {
  const response = await gpApi.post('departments', { json: payload })

  return parseOptionalJson<Department>(response)
}

async function findAll(
  params?: DepartmentsListParams,
): Promise<DepartmentsListResponse> {
  return gpApi
    .get('departments', {
      searchParams: buildSearchParams({
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search,
        status: params?.status,
      }),
    })
    .json<DepartmentsListResponse>()
}

async function findOne(code: number): Promise<Department> {
  return gpApi.get(`departments/${code}`).json<Department>()
}

async function findMyDepartments(): Promise<MyDepartmentsResponse> {
  return gpApi.get('departments/my').json<MyDepartmentsResponse>()
}

async function update(
  code: number,
  payload: UpdateDepartmentDTO,
): Promise<Department | void> {
  const response = await gpApi.patch(`departments/${code}`, { json: payload })

  return parseOptionalJson<Department>(response)
}

async function remove(code: number): Promise<void> {
  await gpApi.delete(`departments/${code}`)
}

export const departmentsService = {
  create,
  findAll,
  findOne,
  findMyDepartments,
  update,
  remove,
}
