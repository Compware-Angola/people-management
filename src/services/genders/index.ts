import { gaApi } from '@/lib/api/ga.api'
import type { GenderFilter, GenderResponse } from './genders.types'

async function findAll(filter?: GenderFilter) {
  const response = await gaApi
    .get('genders', {
      searchParams: filter,
    })
    .json<GenderResponse>()

  return response.data
}

export const gendersService = {
  findAll,
}
