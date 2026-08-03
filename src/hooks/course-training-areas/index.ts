import { QUERY_KEY } from '@/constants/query-key'
import { courseTrainingAreasService } from '@/services/course-training-areas'
import type { CourseTrainingAreaFilter } from '@/services/course-training-areas/course-training-areas.types'
import { queryOptions, useQuery } from '@tanstack/react-query'

export function courseTrainingAreasQueryOptions(
  filter?: CourseTrainingAreaFilter,
) {
  return queryOptions({
    queryKey: [QUERY_KEY.coursesTrainingAreas, 'list', filter],
    queryFn: () => courseTrainingAreasService.findAll(filter),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCourseTrainingAreasQuery(
  filter?: CourseTrainingAreaFilter,
) {
  return useQuery(courseTrainingAreasQueryOptions(filter))
}
