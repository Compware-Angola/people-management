import { gpApi } from '@/lib/api/gp.api'
import type {
  CreatePositionDTO,
  Position,
  PositionsListParams,
  PositionsListResponse,
  UpdatePositionDTO,
} from './positions.types'

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

function buildSearchParams(params?: PositionsListParams) {
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

async function create(payload: CreatePositionDTO): Promise<Position | void> {
  const response = await gpApi.post('positions', { json: payload })

  return parseOptionalJson<Position>(response)
}

async function findAll(
  params?: PositionsListParams,
): Promise<PositionsListResponse> {
  return gpApi
    .get('positions', {
      searchParams: buildSearchParams(params),
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
