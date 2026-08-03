import { gaApi } from '@/lib/api/ga.api'
import type {
  AcademicDegreeFilter,
  AcademicDegreeResponse,
} from './academic-degrees.types'

function buildSearchParams(filter?: AcademicDegreeFilter) {
  const params = new URLSearchParams()

  if (filter?.search) params.append('search', filter.search)
  if (filter?.page) params.append('page', String(filter.page))
  if (filter?.limit) params.append('limit', String(filter.limit))
  if (filter?.status) params.append('status', String(filter.status))

  filter?.ids?.forEach((id) => {
    params.append('ids', String(id))
  })

  return params
}

async function findAll(filter?: AcademicDegreeFilter) {
  const response = await gaApi
    .get('academic-degrees', {
      searchParams: buildSearchParams(filter),
    })
    .json<AcademicDegreeResponse>()

  return response.data
}

export const academicDegreesService = {
  findAll,
}
