import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { departmentsService } from '@/services/departments'
import type {
  CreateDepartmentDTO,
  DepartmentsListParams,
  UpdateDepartmentDTO,
} from '@/services/departments/departments.types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDepartmentsQuery(params?: DepartmentsListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.departments, 'list', params],
    queryFn: () => departmentsService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useDepartmentDetailsQuery(code?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.departments, 'details', code],
    queryFn: () => departmentsService.findOne(code!),
    enabled: Boolean(code),
    staleTime: 1000 * 60 * 5,
  })
}

export function useMyDepartmentsQuery() {
  return useQuery({
    queryKey: [QUERY_KEY.departments, 'my'],
    queryFn: () => departmentsService.findMyDepartments(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateDepartmentMutation() {
  return useMutation({
    mutationFn: (data: CreateDepartmentDTO) => departmentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.departments] })
      toast.success('Departamento registrado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateDepartmentMutation() {
  return useMutation({
    mutationFn: ({
      code,
      data,
    }: {
      code: number
      data: UpdateDepartmentDTO
    }) => departmentsService.update(code, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.departments] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.departments, 'details', params.code],
      })
      toast.success('Departamento atualizado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useRemoveDepartmentMutation() {
  return useMutation({
    mutationFn: (code: number) => departmentsService.remove(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.departments] })
      toast.success('Departamento removido com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
