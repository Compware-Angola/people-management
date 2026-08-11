import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { vacanciesService } from '@/services/vacancies'
import type {
  CreateVacancyDTO,
  UpdateVacancyDTO,
  UploadVacancyDocumentDTO,
  VacanciesListParams,
  VacancyActionDTO,
} from '@/services/vacancies/vacancies.types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useVacanciesQuery(params?: VacanciesListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.vacancies, 'list', params],
    queryFn: () => vacanciesService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useVacancyDetailsQuery(code?: string) {
  return useQuery({
    queryKey: [QUERY_KEY.vacancies, 'details', code],
    queryFn: () => vacanciesService.findOne(code!),
    enabled: Boolean(code),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateVacancyMutation() {
  return useMutation({
    mutationFn: (data: CreateVacancyDTO) => vacanciesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.vacancies] })
      toast.success('Vaga cadastrada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateVacancyMutation() {
  return useMutation({
    mutationFn: ({ code, data }: { code: string; data: UpdateVacancyDTO }) =>
      vacanciesService.update(code, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.vacancies] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.vacancies, 'details', params.code],
      })
      toast.success('Vaga atualizada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUploadVacancyDocumentMutation() {
  return useMutation({
    mutationFn: ({
      code,
      data,
    }: {
      code: string
      data: UploadVacancyDocumentDTO
    }) => vacanciesService.uploadDocument(code, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.vacancies] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.vacancies, 'details', params.code],
      })
      toast.success('Documento anexado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function usePublishVacancyMutation() {
  return useMutation({
    mutationFn: (code: string) => vacanciesService.publish(code),
    onSuccess: (_, code) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.vacancies] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.vacancies, 'details', code],
      })
      toast.success('Vaga publicada ou agendada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useSuspendVacancyMutation() {
  return useMutation({
    mutationFn: ({ code, data }: { code: string; data: VacancyActionDTO }) =>
      vacanciesService.suspend(code, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.vacancies] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.vacancies, 'details', params.code],
      })
      toast.success('Vaga suspensa com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useReactivateVacancyMutation() {
  return useMutation({
    mutationFn: (code: string) => vacanciesService.reactivate(code),
    onSuccess: (_, code) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.vacancies] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.vacancies, 'details', code],
      })
      toast.success('Vaga reativada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useCloseVacancyMutation() {
  return useMutation({
    mutationFn: ({ code, data }: { code: string; data: VacancyActionDTO }) =>
      vacanciesService.close(code, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.vacancies] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.vacancies, 'details', params.code],
      })
      toast.success('Vaga encerrada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useCancelVacancyMutation() {
  return useMutation({
    mutationFn: ({ code, data }: { code: string; data: VacancyActionDTO }) =>
      vacanciesService.cancel(code, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.vacancies] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.vacancies, 'details', params.code],
      })
      toast.success('Vaga cancelada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
