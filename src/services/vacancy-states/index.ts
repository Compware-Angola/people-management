import { gpApi } from '@/lib/api/gp.api'
import type {
  VacancyState,
  VacancyStatesListParams,
  VacancyStatesListResponse,
} from './vacancy-states.types'

function buildSearchParams(params?: VacancyStatesListParams) {
  const searchParams = new URLSearchParams()

  searchParams.set('page', String(params?.page ?? 1))
  searchParams.set('limit', String(params?.limit ?? 10))

  if (params?.search) {
    searchParams.set('search', params.search)
  }

  if (params?.acronym) {
    searchParams.set('acronym', params.acronym)
  }

  if (params?.code) {
    searchParams.set('code', String(params.code))
  }

  return searchParams
}

async function findAll(
  params?: VacancyStatesListParams,
): Promise<VacancyStatesListResponse> {
  return gpApi
    .get('vacancy-states', {
      searchParams: buildSearchParams(params),
    })
    .json<VacancyStatesListResponse>()
}

async function findOne(code: number): Promise<VacancyState> {
  return gpApi.get(`vacancy-states/${code}`).json<VacancyState>()
}

export const vacancyStatesService = {
  findAll,
  findOne,
}
