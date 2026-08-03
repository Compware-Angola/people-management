import { gaApi } from '@/lib/api/ga.api'
import type {
  NationalityFilter,
  NationalityResponse,
} from './nationalities.types'

async function findAll(filter?: NationalityFilter) {
  const response = await gaApi
    .get('nacionalities', {
      searchParams: filter,
    })
    .json<NationalityResponse>()

  return response.data
}

export const nationalitiesService = {
  findAll,
}
