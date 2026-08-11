import { gpApi } from '@/lib/api/gp.api'
import type {
  HiringType,
  HiringTypesListParams,
  HiringTypesListResponse,
} from './hiring-types.types'

function buildSearchParams(params?: HiringTypesListParams) {
  const searchParams = new URLSearchParams()

  searchParams.set('page', String(params?.page ?? 1))
  searchParams.set('limit', String(params?.limit ?? 10))

  if (params?.search) {
    searchParams.set('search', params.search)
  }

  if (params?.acronym) {
    searchParams.set('acronym', params.acronym)
  }

  if (params?.status !== undefined) {
    searchParams.set('status', String(params.status))
  }

  return searchParams
}

async function findAll(
  params?: HiringTypesListParams,
): Promise<HiringTypesListResponse> {
  return gpApi
    .get('hiring-types', {
      searchParams: buildSearchParams(params),
    })
    .json<HiringTypesListResponse>()
}

async function findOne(code: number): Promise<HiringType> {
  return gpApi.get(`hiring-types/${code}`).json<HiringType>()
}

export const hiringTypesService = {
  findAll,
  findOne,
}
