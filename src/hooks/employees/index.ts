import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { employeesService } from '@/services/employees'
import type {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  EmployeeListParams,
} from '@/services/employees/employees.types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useEmployeesQuery(params?: EmployeeListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.employees, 'list', params],
    queryFn: () => employeesService.findAll(params),
    staleTime: 1000 * 60 * 5,
     placeholderData: keepPreviousData,
  })
}

export function useCreateEmployeeMutation() {
  return useMutation({
    mutationFn: (data: CreateEmployeeDTO) => employeesService.create(data),
    onSuccess: (_,params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.employees, 'list'] })
      toast.success(`Coladorador, ${params.name} criado com sucesso`)
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateEmployeeMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeDTO }) =>
      employeesService.update(id, data),
    onSuccess: (_,params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.employees, 'list'] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.employees, 'deatils', params.id] })
      toast.success(`Os dados do Colaboradores, ${params.data.name}`)
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}