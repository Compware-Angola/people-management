import { QUERY_KEY } from '@/constants/query-key'
import { vacancyStatesService } from '@/services/vacancy-states'
import type { VacancyStatesListParams } from '@/services/vacancy-states/vacancy-states.types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function useVacancyStatesQuery(params?: VacancyStatesListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.vacancyStates, 'list', params],
    queryFn: () => vacancyStatesService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useVacancyStateDetailsQuery(code?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.vacancyStates, 'details', code],
    queryFn: () => vacancyStatesService.findOne(code!),
    enabled: Boolean(code),
    staleTime: 1000 * 60 * 5,
  })
}
