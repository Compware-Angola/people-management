import { QUERY_KEY } from '@/constants/query-key'
import { maritalStatusService } from '@/services/marital-status'
import type { MaritalStatusFilter } from '@/services/marital-status/marital-status.types'
import { queryOptions, useQuery } from '@tanstack/react-query'

export function maritalStatusQueryOptions(filter?: MaritalStatusFilter) {
  return queryOptions({
    queryKey: [QUERY_KEY.maritalStatus, 'list', filter],
    queryFn: () => maritalStatusService.findAll(filter),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useMaritalStatusQuery(filter?: MaritalStatusFilter) {
  return useQuery(maritalStatusQueryOptions(filter))
}
