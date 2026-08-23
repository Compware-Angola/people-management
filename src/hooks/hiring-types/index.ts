import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { hiringTypesService } from '@/services/hiring-types'
import type {
  CreateHiringTypeDTO,
  HiringTypesListParams,
  UpdateHiringTypeDTO,
} from '@/services/hiring-types/hiring-types.types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useHiringTypesQuery(params?: HiringTypesListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.hiringTypes, 'list', params],
    queryFn: () => hiringTypesService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useHiringTypeDetailsQuery(code?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.hiringTypes, 'details', code],
    queryFn: () => hiringTypesService.findOne(code!),
    enabled: Boolean(code),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateHiringTypeMutation() {
  return useMutation({
    mutationFn: (data: CreateHiringTypeDTO) => hiringTypesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.hiringTypes] })
      toast.success('Tipo de contratação registrado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateHiringTypeMutation() {
  return useMutation({
    mutationFn: ({
      code,
      data,
    }: {
      code: number
      data: UpdateHiringTypeDTO
    }) => hiringTypesService.update(code, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.hiringTypes] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.hiringTypes, 'details', params.code],
      })
      toast.success('Tipo de contratação atualizado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useRemoveHiringTypeMutation() {
  return useMutation({
    mutationFn: (code: number) => hiringTypesService.remove(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.hiringTypes] })
      toast.success('Tipo de contratação removido com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
