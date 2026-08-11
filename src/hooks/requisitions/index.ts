import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { requisitionsService } from '@/services/requisitions'
import type {
  AnalyzeRequisitionFinancialDTO,
  AnalyzeRequisitionRhDTO,
  CancelRequisitionDTO,
  CreateRequisitionDTO,
  RequisitionsListParams,
  UpdateRequisitionDTO,
} from '@/services/requisitions/requisitions.types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useRequisitionsQuery(params?: RequisitionsListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.requisitions, 'list', params],
    queryFn: () => requisitionsService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useRequisitionDetailsQuery(code?: string) {
  return useQuery({
    queryKey: [QUERY_KEY.requisitions, 'details', code],
    queryFn: () => requisitionsService.findOne(code!),
    enabled: Boolean(code),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateRequisitionMutation() {
  return useMutation({
    mutationFn: (data: CreateRequisitionDTO) => requisitionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.requisitions] })
      toast.success('Requisição registrada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateRequisitionMutation() {
  return useMutation({
    mutationFn: ({ code, data }: { code: string; data: UpdateRequisitionDTO }) =>
      requisitionsService.update(code, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.requisitions] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.requisitions, 'details', params.code],
      })
      toast.success('Requisição atualizada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useRemoveRequisitionMutation() {
  return useMutation({
    mutationFn: (code: string) => requisitionsService.remove(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.requisitions] })
      toast.success('Requisição removida com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useSendRequisitionMutation() {
  return useMutation({
    mutationFn: (code: string) => requisitionsService.send(code),
    onSuccess: (_, code) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.requisitions] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.requisitions, 'details', code],
      })
      toast.success('Requisição enviada para aprovação')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useCancelRequisitionMutation() {
  return useMutation({
    mutationFn: ({
      code,
      data,
    }: {
      code: string
      data: CancelRequisitionDTO
    }) => requisitionsService.cancel(code, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.requisitions] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.requisitions, 'details', params.code],
      })
      toast.success('Requisição cancelada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useAnalyzeRequisitionRhMutation() {
  return useMutation({
    mutationFn: ({
      code,
      data,
    }: {
      code: string
      data: AnalyzeRequisitionRhDTO
    }) => requisitionsService.analyzeRh(code, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.requisitions] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.requisitions, 'details', params.code],
      })
      toast.success('Análise do RH registrada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useAnalyzeRequisitionFinancialMutation() {
  return useMutation({
    mutationFn: ({
      code,
      data,
    }: {
      code: string
      data: AnalyzeRequisitionFinancialDTO
    }) => requisitionsService.analyzeFinancial(code, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.requisitions] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.requisitions, 'details', params.code],
      })
      toast.success('Análise financeira registrada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
