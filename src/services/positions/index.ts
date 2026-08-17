import { gpApi } from '@/lib/api/gp.api'
import { buildSearchParams } from '@/lib/api/build-search-params'
import { parseOptionalJson } from '@/lib/api/parse-optional-json'
import type {
  CreatePositionDTO,
  Position,
  PositionsListParams,
  PositionsListResponse,
  UpdatePositionDTO,
} from './positions.types'

async function create(payload: CreatePositionDTO): Promise<Position | void> {
  const response = await gpApi.post('positions', { json: payload })

  return parseOptionalJson<Position>(response)
}

async function findAll(
  params?: PositionsListParams,
): Promise<PositionsListResponse> {
  return gpApi
    .get('positions', {
      searchParams: buildSearchParams({
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search,
        status: params?.status,
      }),
    })
    .json<PositionsListResponse>()
}

async function findOne(code: number): Promise<Position> {
  return gpApi.get(`positions/${code}`).json<Position>()
}

async function update(
  code: number,
  payload: UpdatePositionDTO,
): Promise<Position | void> {
  const response = await gpApi.patch(`positions/${code}`, { json: payload })

  return parseOptionalJson<Position>(response)
}

async function remove(code: number): Promise<void> {
  await gpApi.delete(`positions/${code}`)
}

export const positionsService = {
  create,
  findAll,
  findOne,
  update,
  remove,
}
