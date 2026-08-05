import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { biometricsService } from '@/services/biometrics'
import type {
  BiometricEquipmentListParams,
  BiometricIntegrationListParams,
  CreateBiometricEquipmentDTO,
  CreateBiometricIntegrationDTO,
  UpdateBiometricEquipmentDTO,
} from '@/services/biometrics/biometrics.types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useBiometricEquipmentsQuery(
  params?: BiometricEquipmentListParams,
) {
  return useQuery({
    queryKey: [QUERY_KEY.biometrics, 'equipments', 'list', params],
    queryFn: () => biometricsService.findAllEquipments(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useBiometricEquipmentDetailsQuery(id?: string) {
  return useQuery({
    queryKey: [QUERY_KEY.biometrics, 'equipments', 'details', id],
    queryFn: () => biometricsService.findOneEquipment(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateBiometricEquipmentMutation() {
  return useMutation({
    mutationFn: (data: CreateBiometricEquipmentDTO) =>
      biometricsService.createEquipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.biometrics, 'equipments'],
      })
      toast.success('Equipamento cadastrado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateBiometricEquipmentMutation() {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateBiometricEquipmentDTO
    }) => biometricsService.updateEquipment(id, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.biometrics, 'equipments'],
      })
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.biometrics,
          'equipments',
          'details',
          params.id,
        ],
      })
      toast.success('Equipamento atualizado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useBiometricIntegrationsQuery(
  params?: BiometricIntegrationListParams,
) {
  return useQuery({
    queryKey: [QUERY_KEY.biometrics, 'integrations', 'list', params],
    queryFn: () => biometricsService.findAllIntegrations(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useEmployeeBiometricIntegrationsQuery(employeeId?: string) {
  return useQuery({
    queryKey: [
      QUERY_KEY.biometrics,
      'integrations',
      'employee',
      employeeId,
    ],
    queryFn: () => biometricsService.findIntegrationsByEmployee(employeeId!),
    enabled: Boolean(employeeId),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateBiometricIntegrationMutation() {
  return useMutation({
    mutationFn: (data: CreateBiometricIntegrationDTO) =>
      biometricsService.createIntegration(data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.biometrics, 'integrations'],
      })
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.biometrics,
          'integrations',
          'employee',
          String(params.employeeId),
        ],
      })
      toast.success('Evento biométrico registrado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
