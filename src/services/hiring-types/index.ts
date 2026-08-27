import { gpApi } from '@/lib/api/gp.api'
import { buildSearchParams } from '@/lib/api/build-search-params'
import { parseOptionalJson } from '@/lib/api/parse-optional-json'
import type {
  CreateHiringTypeDTO,
  HiringType,
  HiringTypesListParams,
  HiringTypesListResponse,
  UpdateHiringTypeDTO,
} from './hiring-types.types'

async function create(payload: CreateHiringTypeDTO): Promise<HiringType | void> {
  const response = await gpApi.post('hiring-types', { json: payload })

  return parseOptionalJson<HiringType>(response)
}

async function findAll(
  params?: HiringTypesListParams,
): Promise<HiringTypesListResponse> {
  return gpApi
    .get('hiring-types', {
      searchParams: buildSearchParams({
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search,
        acronym: params?.acronym,
        status: params?.status,
      }),
    })
    .json<HiringTypesListResponse>()
}

async function findOne(code: number): Promise<HiringType> {
  return gpApi.get(`hiring-types/${code}`).json<HiringType>()
}

async function update(
  code: number,
  payload: UpdateHiringTypeDTO,
): Promise<HiringType | void> {
  const response = await gpApi.patch(`hiring-types/${code}`, { json: payload })

  return parseOptionalJson<HiringType>(response)
}

async function remove(code: number): Promise<void> {
  await gpApi.delete(`hiring-types/${code}`)
}

export const hiringTypesService = {
  create,
  findAll,
  findOne,
  update,
  remove,
}
