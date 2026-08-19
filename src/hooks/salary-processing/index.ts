import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { salaryProcessingService } from '@/services/salary-processing'
import type {
  CreateSalaryProcessingDTO,
  SalaryProcessingListParams,
  ValidateSalaryProcessingDTO,
} from '@/services/salary-processing/salary-processing.types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useSalaryProcessingQuery(
  params?: SalaryProcessingListParams,
) {
  return useQuery({
    queryKey: [QUERY_KEY.salaryProcessing, 'list', params],
    queryFn: () => salaryProcessingService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useSalaryProcessingDetailsQuery(id?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.salaryProcessing, 'details', id],
    queryFn: () => salaryProcessingService.findOne(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateSalaryProcessingMutation() {
  return useMutation({
    mutationFn: (data: CreateSalaryProcessingDTO) =>
      salaryProcessingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.salaryProcessing],
      })
      toast.success('Processamento salarial iniciado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useValidateSalaryProcessingMutation() {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: ValidateSalaryProcessingDTO
    }) => salaryProcessingService.validate(id, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.salaryProcessing],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.salaryProcessing, 'details', params.id],
      })
      toast.success('Processamento salarial validado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useReprocessSalaryMutation() {
  return useMutation({
    mutationFn: (id: number) => salaryProcessingService.reprocess(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.salaryProcessing],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.salaryProcessing, 'details', id],
      })
      toast.success('Reprocessamento salarial iniciado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
