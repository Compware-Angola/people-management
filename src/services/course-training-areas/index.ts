import { gaApi } from '@/lib/api/ga.api'
import type {
  CourseTrainingAreaFilter,
  CourseTrainingAreaResponse,
} from './course-training-areas.types'

async function findAll(filter?: CourseTrainingAreaFilter) {
  const response = await gaApi
    .get('course-training-areas', {
      searchParams: filter,
    })
    .json<CourseTrainingAreaResponse>()

  return response.data
}

export const courseTrainingAreasService = {
  findAll,
}
