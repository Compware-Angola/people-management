import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { vacationsService } from '@/services/vacations'
import type {
  CreateVacationDTO,
  UpdateVacationDTO,
  VacationListParams,
} from '@/services/vacations/vacations.types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useVacationsQuery(params?: VacationListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.vacations, 'list', params],
    queryFn: () => vacationsService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useVacationDetailsQuery(id?: string) {
  return useQuery({
    queryKey: [QUERY_KEY.vacations, 'details', id],
    queryFn: () => vacationsService.findOne(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateVacationMutation() {
  return useMutation({
    mutationFn: (data: CreateVacationDTO) => vacationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.vacations] })
      toast.success('Férias registradas com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateVacationMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVacationDTO }) =>
      vacationsService.update(id, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.vacations] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.vacations, 'details', params.id],
      })
      toast.success('Férias atualizadas com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useRemoveVacationMutation() {
  return useMutation({
    mutationFn: (id: string) => vacationsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.vacations] })
      toast.success('Férias removidas com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
