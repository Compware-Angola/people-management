import { QUERY_KEY } from '@/constants/query-key'
import { vacancyRequestTypesService } from '@/services/vacancy-request-types'
import type { VacancyRequestTypesListParams } from '@/services/vacancy-request-types/vacancy-request-types.types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function useVacancyRequestTypesQuery(
  params?: VacancyRequestTypesListParams,
) {
  return useQuery({
    queryKey: [QUERY_KEY.vacancyRequestTypes, 'list', params],
    queryFn: () => vacancyRequestTypesService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useVacancyRequestTypeDetailsQuery(id?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.vacancyRequestTypes, 'details', id],
    queryFn: () => vacancyRequestTypesService.findOne(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}
