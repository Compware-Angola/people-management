import { gpApi } from '@/lib/api/gp.api'
import { buildSearchParams } from '@/lib/api/build-search-params'
import { parseOptionalJson } from '@/lib/api/parse-optional-json'
import type {
  CostCenter,
  CostCentersListParams,
  CostCentersListResponse,
  CreateCostCenterDTO,
  UpdateCostCenterDTO,
} from './cost-centers.types'

async function create(payload: CreateCostCenterDTO): Promise<CostCenter | void> {
  const response = await gpApi.post('cost-centers', { json: payload })

  return parseOptionalJson<CostCenter>(response)
}

async function findAll(
  params?: CostCentersListParams,
): Promise<CostCentersListResponse> {
  return gpApi
    .get('cost-centers', {
      searchParams: buildSearchParams({
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search,
        departmentId: params?.departmentId,
        status: params?.status,
      }),
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
