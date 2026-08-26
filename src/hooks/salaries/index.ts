import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { salariesService } from '@/services/salaries'
import type {
  CreateRubricDTO,
  CreateSalaryDTO,
  CreateSalaryEmployeeDTO,
  CreateSalaryRubricDTO,
  RubricListParams,
  SalaryListParams,
  UpdateSalaryDTO,
} from '@/services/salaries/salaries.types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useSalariesQuery(params?: SalaryListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.salaries, 'list', params],
    queryFn: () => salariesService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useEmployeeSalaryQuery(employeeId?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.salaries, 'employee', employeeId],
    queryFn: () => salariesService.findEmployeeSalary(employeeId!),
    enabled: Boolean(employeeId),
    staleTime: 1000 * 60 * 5,
  })
}

export function useEmployeeSalaryHistoryQuery(employeeId?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.salaries, 'employee-history', employeeId],
    queryFn: () => salariesService.findEmployeeSalaryHistory(employeeId!),
    enabled: Boolean(employeeId),
    staleTime: 1000 * 60 * 5,
  })
}

export function useSalaryStructureRubricsQuery(id?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.salaries, 'rubrics', id],
    queryFn: () => salariesService.findSalaryStructureWithRubrics(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export function useRubricsQuery(params?: RubricListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.salaries, 'rubrics-list', params],
    queryFn: () => salariesService.findAllRubrics(params),
    enabled: Boolean(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useCreateSalaryMutation() {
  return useMutation({
    mutationFn: (data: CreateSalaryDTO) => salariesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.salaries] })
      toast.success('Estrutura salarial registrada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateSalaryMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSalaryDTO }) =>
      salariesService.update(id, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.salaries] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.salaries, 'rubrics', params.id],
      })
      toast.success('Estrutura salarial atualizada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useAssignSalaryToEmployeeMutation() {
  return useMutation({
    mutationFn: (data: CreateSalaryEmployeeDTO) =>
      salariesService.assignToEmployee(data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.salaries] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.salaries, 'employee', params.employeeId],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.salaries, 'employee-history', params.employeeId],
      })
      toast.success('Estrutura salarial atribuida ao colaborador com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useCreateRubricMutation() {
  return useMutation({
    mutationFn: (data: CreateRubricDTO) => salariesService.createRubric(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.salaries] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.salaries, 'rubrics-list'],
      })
      toast.success('Rubrica registrada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useAssociateRubricToStructureMutation() {
  return useMutation({
    mutationFn: (data: CreateSalaryRubricDTO) =>
      salariesService.associateRubricToStructure(data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.salaries] })
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.salaries,
          'rubrics',
          params.salaryStructureCode,
        ],
      })
      toast.success('Rubrica associada a estrutura salarial com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
