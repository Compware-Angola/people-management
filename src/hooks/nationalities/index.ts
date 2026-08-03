import { QUERY_KEY } from '@/constants/query-key'
import { nationalitiesService } from '@/services/nationalities'
import type { NationalityFilter } from '@/services/nationalities/nationalities.types'
import { queryOptions, useQuery } from '@tanstack/react-query'

export function nationalitiesQueryOptions(filter?: NationalityFilter) {
  return queryOptions({
    queryKey: [QUERY_KEY.nationalities, 'list', filter],
    queryFn: () => nationalitiesService.findAll(filter),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useNationalitiesQuery(filter?: NationalityFilter) {
  return useQuery(nationalitiesQueryOptions(filter))
}
