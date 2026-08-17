import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { costCentersService } from '@/services/cost-centers'
import type {
  CostCentersListParams,
  CreateCostCenterDTO,
  UpdateCostCenterDTO,
} from '@/services/cost-centers/cost-centers.types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useCostCentersQuery(params?: CostCentersListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.costCenters, 'list', params],
    queryFn: () => costCentersService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useCostCenterDetailsQuery(code?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.costCenters, 'details', code],
    queryFn: () => costCentersService.findOne(code!),
    enabled: Boolean(code),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateCostCenterMutation() {
  return useMutation({
    mutationFn: (data: CreateCostCenterDTO) => costCentersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.costCenters] })
      toast.success('Centro de custo registrado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateCostCenterMutation() {
  return useMutation({
    mutationFn: ({
      code,
      data,
    }: {
      code: number
      data: UpdateCostCenterDTO
    }) => costCentersService.update(code, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.costCenters] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.costCenters, 'details', params.code],
      })
      toast.success('Centro de custo atualizado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useRemoveCostCenterMutation() {
  return useMutation({
    mutationFn: (code: number) => costCentersService.remove(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.costCenters] })
      toast.success('Centro de custo removido com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
