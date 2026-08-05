import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { employeesService } from '@/services/employees'
import type {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  CreateEmployeeFileDTO,
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

export function useEmployeeQuery(id?: string) {
  return useQuery({
    queryKey: [QUERY_KEY.employees, 'details', id],
    queryFn: () => employeesService.findOne(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateEmployeeMutation() {
  return useMutation({
    mutationFn: (data: CreateEmployeeDTO) => employeesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.employees, 'list'] })
      toast.success('Colaborador criado com sucesso')
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
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.employees, 'list'] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.employees, 'details', params.id] })
      toast.success('Dados do colaborador atualizados com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useAddEmployeeFileMutation() {
  return useMutation({
    mutationFn: (data: CreateEmployeeFileDTO) => employeesService.addFile(data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.employees, 'details'] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.employees, 'list'] })
      toast.success(`Documento ${params.originalName} adicionado com sucesso`)
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useRemoveEmployeeFileMutation() {
  return useMutation({
    mutationFn: (id: string) => employeesService.removeFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.employees, 'details'] })
      toast.success('Documento removido com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
