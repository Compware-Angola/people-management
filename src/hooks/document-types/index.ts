import { QUERY_KEY } from '@/constants/query-key'
import { documentTypesService } from '@/services/document-types'
import type { DocumentTypeFilter } from '@/services/document-types/document-types.types'
import { queryOptions, useQuery } from '@tanstack/react-query'

export function documentTypesQueryOptions(filter?: DocumentTypeFilter) {
  return queryOptions({
    queryKey: [QUERY_KEY.documentTypes, 'list', filter],
    queryFn: () => documentTypesService.findAll(filter),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useDocumentTypesQuery(filter?: DocumentTypeFilter) {
  return useQuery(documentTypesQueryOptions(filter))
}
