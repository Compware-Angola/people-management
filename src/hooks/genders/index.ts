import { QUERY_KEY } from '@/constants/query-key'
import { gendersService } from '@/services/genders'
import type { GenderFilter } from '@/services/genders/genders.types'
import { queryOptions, useQuery } from '@tanstack/react-query'

export function gendersQueryOptions(filter?: GenderFilter) {
  return queryOptions({
    queryKey: [QUERY_KEY.gender, 'list', filter],
    queryFn: () => gendersService.findAll(filter),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useGendersQuery(filter?: GenderFilter) {
  return useQuery(gendersQueryOptions(filter))
}
