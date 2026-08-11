import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { positionsService } from '@/services/positions'
import type {
  CreatePositionDTO,
  PositionsListParams,
  UpdatePositionDTO,
} from '@/services/positions/positions.types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function usePositionsQuery(params?: PositionsListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.positions, 'list', params],
    queryFn: () => positionsService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function usePositionDetailsQuery(code?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.positions, 'details', code],
    queryFn: () => positionsService.findOne(code!),
    enabled: Boolean(code),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreatePositionMutation() {
  return useMutation({
    mutationFn: (data: CreatePositionDTO) => positionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.positions] })
      toast.success('Cargo registrado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdatePositionMutation() {
  return useMutation({
    mutationFn: ({ code, data }: { code: number; data: UpdatePositionDTO }) =>
      positionsService.update(code, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.positions] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.positions, 'details', params.code],
      })
      toast.success('Cargo atualizado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useRemovePositionMutation() {
  return useMutation({
    mutationFn: (code: number) => positionsService.remove(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.positions] })
      toast.success('Cargo removido com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
