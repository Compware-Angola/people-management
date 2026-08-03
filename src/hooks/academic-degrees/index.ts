import { QUERY_KEY } from '@/constants/query-key'
import { academicDegreesService } from '@/services/academic-degrees'
import type { AcademicDegreeFilter } from '@/services/academic-degrees/academic-degrees.types'
import { queryOptions, useQuery } from '@tanstack/react-query'

export function academicDegreesQueryOptions(filter?: AcademicDegreeFilter) {
  return queryOptions({
    queryKey: [QUERY_KEY.academicDegrees, 'list', filter],
    queryFn: () => academicDegreesService.findAll(filter),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useAcademicDegreesQuery(filter?: AcademicDegreeFilter) {
  return useQuery(academicDegreesQueryOptions(filter))
}
