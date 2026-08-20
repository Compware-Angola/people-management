import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { contractsService } from '@/services/contracts'
import type {
  AssignContractToEmployeeDTO,
  ContractsListParams,
  CreateContractDTO,
  UpdateContractDTO,
} from '@/services/contracts/contracts.types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useContractsQuery(params?: ContractsListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.contracts, 'list', params],
    queryFn: () => contractsService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useEmployeeActiveContractQuery(employeeId?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.contracts, 'employee-active', employeeId],
    queryFn: () => contractsService.findEmployeeActiveContract(employeeId!),
    enabled: Boolean(employeeId),
    staleTime: 1000 * 60 * 5,
  })
}

export function useEmployeeContractHistoryQuery(employeeId?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.contracts, 'employee-history', employeeId],
    queryFn: () => contractsService.findEmployeeContractHistory(employeeId!),
    enabled: Boolean(employeeId),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateContractMutation() {
  return useMutation({
    mutationFn: (data: CreateContractDTO) => contractsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.contracts] })
      toast.success('Contrato registrado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateContractMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateContractDTO }) =>
      contractsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.contracts] })
      toast.success('Contrato atualizado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useAssignContractToEmployeeMutation() {
  return useMutation({
    mutationFn: (data: AssignContractToEmployeeDTO) =>
      contractsService.assignToEmployee(data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.contracts] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.contracts, 'employee-active', params.employeeId],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.contracts, 'employee-history', params.employeeId],
      })
      toast.success('Contrato atribuído ao colaborador com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
