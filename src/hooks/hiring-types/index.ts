import { QUERY_KEY } from '@/constants/query-key'
import { hiringTypesService } from '@/services/hiring-types'
import type { HiringTypesListParams } from '@/services/hiring-types/hiring-types.types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function useHiringTypesQuery(params?: HiringTypesListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.hiringTypes, 'list', params],
    queryFn: () => hiringTypesService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useHiringTypeDetailsQuery(code?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.hiringTypes, 'details', code],
    queryFn: () => hiringTypesService.findOne(code!),
    enabled: Boolean(code),
    staleTime: 1000 * 60 * 5,
  })
}
