import { gpApi } from '@/lib/api/gp.api'
import { buildSearchParams } from '@/lib/api/build-search-params'
import type {
  VacancyRequestType,
  VacancyRequestTypesListParams,
  VacancyRequestTypesListResponse,
} from './vacancy-request-types.types'

async function findAll(
  params?: VacancyRequestTypesListParams,
): Promise<VacancyRequestTypesListResponse> {
  return gpApi
    .get('vacancy-request-types', {
      searchParams: buildSearchParams({
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search,
        status: params?.status,
      }),
    })
    .json<VacancyRequestTypesListResponse>()
}

async function findOne(id: number): Promise<VacancyRequestType> {
  return gpApi.get(`vacancy-request-types/${id}`).json<VacancyRequestType>()
}

export const vacancyRequestTypesService = {
  findAll,
  findOne,
}
