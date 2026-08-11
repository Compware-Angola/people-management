import { gpApi } from '@/lib/api/gp.api'
import type {
  CostCenter,
  CostCentersListParams,
  CostCentersListResponse,
  CreateCostCenterDTO,
  UpdateCostCenterDTO,
} from './cost-centers.types'

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

function buildSearchParams(params?: CostCentersListParams) {
  const searchParams = new URLSearchParams()

  searchParams.set('page', String(params?.page ?? 1))
  searchParams.set('limit', String(params?.limit ?? 10))

  if (params?.search) {
    searchParams.set('search', params.search)
  }

  if (params?.departmentId) {
    searchParams.set('departmentId', String(params.departmentId))
  }

  if (params?.status !== undefined) {
    searchParams.set('status', String(params.status))
  }

  return searchParams
}

async function create(payload: CreateCostCenterDTO): Promise<CostCenter | void> {
  const response = await gpApi.post('cost-centers', { json: payload })

  return parseOptionalJson<CostCenter>(response)
}

async function findAll(
  params?: CostCentersListParams,
): Promise<CostCentersListResponse> {
  return gpApi
    .get('cost-centers', {
      searchParams: buildSearchParams(params),
    })
    .json<CostCentersListResponse>()
}

async function findOne(code: number): Promise<CostCenter> {
  return gpApi.get(`cost-centers/${code}`).json<CostCenter>()
}

async function update(
  code: number,
  payload: UpdateCostCenterDTO,
): Promise<CostCenter | void> {
  const response = await gpApi.patch(`cost-centers/${code}`, { json: payload })

  return parseOptionalJson<CostCenter>(response)
}

async function remove(code: number): Promise<void> {
  await gpApi.delete(`cost-centers/${code}`)
}

export const costCentersService = {
  create,
  findAll,
  findOne,
  update,
  remove,
}
