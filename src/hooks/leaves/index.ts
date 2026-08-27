import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { leavesService } from '@/services/leaves'
import type {
  CreateLeaveDTO,
  LeaveListParams,
  UpdateLeaveDTO,
} from '@/services/leaves/leaves.types'

export function useLeavesQuery(params?: LeaveListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.leaves, 'list', params],
    queryFn: () => leavesService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useCreateLeaveMutation() {
  return useMutation({
    mutationFn: (data: CreateLeaveDTO) => leavesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.leaves] })
      toast.success('Licença registrada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateLeaveMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeaveDTO }) =>
      leavesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.leaves] })
      toast.success('Licença atualizada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
