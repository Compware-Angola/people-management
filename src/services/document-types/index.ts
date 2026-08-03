import { gaApi } from '@/lib/api/ga.api'
import type {
  DocumentTypeFilter,
  DocumentTypeResponse,
} from './document-types.types'

function buildSearchParams(filter?: DocumentTypeFilter) {
  const params = new URLSearchParams()

  if (filter?.search) params.append('search', filter.search)
  if (filter?.page) params.append('page', String(filter.page))
  if (filter?.limit) params.append('limit', String(filter.limit))

  filter?.ids?.forEach((id) => {
    params.append('ids', String(id))
  })

  return params
}

async function findAll(filter?: DocumentTypeFilter) {
  const response = await gaApi
    .get('document-type', {
      searchParams: buildSearchParams(filter),
    })
    .json<DocumentTypeResponse>()

  return response.data
}

export const documentTypesService = {
  findAll,
}
