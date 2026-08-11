import { gpApi } from '@/lib/api/gp.api'
import type {
  CreateDepartmentDTO,
  Department,
  DepartmentsListParams,
  DepartmentsListResponse,
  UpdateDepartmentDTO,
} from './departments.types'

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

function buildSearchParams(params?: DepartmentsListParams) {
  const searchParams = new URLSearchParams()

  searchParams.set('page', String(params?.page ?? 1))
  searchParams.set('limit', String(params?.limit ?? 10))

  if (params?.search) {
    searchParams.set('search', params.search)
  }

  if (params?.status !== undefined) {
    searchParams.set('status', String(params.status))
  }

  return searchParams
}

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
      searchParams: buildSearchParams(params),
    })
    .json<DepartmentsListResponse>()
}

async function findOne(code: number): Promise<Department> {
  return gpApi.get(`departments/${code}`).json<Department>()
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
  update,
  remove,
}
