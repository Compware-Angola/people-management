import { QUERY_KEY } from '@/constants/query-key'
import { requisitionStatesService } from '@/services/requisition-states'
import type { RequisitionStatesListParams } from '@/services/requisition-states/requisition-states.types'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function useRequisitionStatesQuery(
  params?: RequisitionStatesListParams,
) {
  return useQuery({
    queryKey: [QUERY_KEY.requisitionStates, 'list', params],
    queryFn: () => requisitionStatesService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useRequisitionStateDetailsQuery(code?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.requisitionStates, 'details', code],
    queryFn: () => requisitionStatesService.findOne(code!),
    enabled: Boolean(code),
    staleTime: 1000 * 60 * 5,
  })
}
