import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { employeesService } from '@/services/employees'

import type {
  CreateEmployeeDTO,
  CreateEmployeeFileDTO,
  EmployeeListParams,
  UpdateEmployeeDTO,
} from '@/services/employees/employees.types'

/**
 * ============================================================
 * Query Options
 * ============================================================
 */

/**
 * Lista de colaboradores
 *
 * Pode ser utilizada por:
 * - useQuery
 * - prefetchQuery
 * - ensureQueryData
 * - loaders do TanStack Router
 */
export function employeesListQueryOptions(
  params?: EmployeeListParams,
) {
  return queryOptions({
    queryKey: [QUERY_KEY.employees, 'list', params],

    queryFn: () => employeesService.findAll(params),

    staleTime: 1000 * 60 * 5,

    // Mantém os dados da página anterior enquanto
    // a nova página está sendo carregada.
    placeholderData: keepPreviousData,
  })
}

/**
 * Detalhes do colaborador
 */
export function employeeDetailsQueryOptions(id?: string) {
  return queryOptions({
    queryKey: [QUERY_KEY.employees, 'details', id],

    queryFn: () => employeesService.findOne(id!),

    enabled: Boolean(id),

    staleTime: 1000 * 60 * 5,
  })
}

/**
 * ============================================================
 * Queries
 * ============================================================
 */

export function useEmployeesQuery(params?: EmployeeListParams) {
  return useQuery(
    employeesListQueryOptions(params),
  )
}

export function useEmployeeQuery(id?: string) {
  return useQuery(
    employeeDetailsQueryOptions(id),
  )
}

/**
 * ============================================================
 * Mutations
 * ============================================================
 */

export function useCreateEmployeeMutation() {
  return useMutation({
    mutationFn: (data: CreateEmployeeDTO) =>
      employeesService.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.employees, 'list'],
      })

      toast.success('Colaborador criado com sucesso')
    },

    onError: async (error) => {
      toast.error(
        await getApiErrorMessage(error),
      )
    },
  })
}

export function useUpdateEmployeeMutation() {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateEmployeeDTO
    }) =>
      employeesService.update(id, data),

    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.employees, 'list'],
      })

      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.employees,
          'details',
          params.id,
        ],
      })

      toast.success(
        'Dados do colaborador atualizados com sucesso',
      )
    },

    onError: async (error) => {
      toast.error(
        await getApiErrorMessage(error),
      )
    },
  })
}

export function useAddEmployeeFileMutation() {
  return useMutation({
    mutationFn: (data: CreateEmployeeFileDTO) =>
      employeesService.addFile(data),

    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.employees,
          'details',
        ],
      })

      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.employees,
          'list',
        ],
      })

      toast.success(
        `Documento ${params.originalName} adicionado com sucesso`,
      )
    },

    onError: async (error) => {
      toast.error(
        await getApiErrorMessage(error),
      )
    },
  })
}

export function useRemoveEmployeeFileMutation() {
  return useMutation({
    mutationFn: (id: string) =>
      employeesService.removeFile(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.employees,
          'details',
        ],
      })

      toast.success(
        'Documento removido com sucesso',
      )
    },

    onError: async (error) => {
      toast.error(
        await getApiErrorMessage(error),
      )
    },
  })
}