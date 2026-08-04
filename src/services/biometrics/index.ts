import { gpApi } from '@/lib/api/gp.api'
import type {
  BiometricEquipment,
  BiometricEquipmentListParams,
  BiometricEquipmentListResponse,
  BiometricIntegration,
  BiometricIntegrationListParams,
  BiometricIntegrationListResponse,
  CreateBiometricEquipmentDTO,
  CreateBiometricIntegrationDTO,
  UpdateBiometricEquipmentDTO,
} from './biometrics.types'

async function parseOptionalJson<T>(response: Response): Promise<T | void> {
  if (response.status === 204) {
    return
  }

  const body = await response.text()

  if (!body) {
    return
  }

  return JSON.parse(body) as T
}

function buildPaginationSearchParams(
  params?: BiometricEquipmentListParams | BiometricIntegrationListParams,
) {
  const searchParams = new URLSearchParams()

  searchParams.set('page', String(params?.page ?? 1))
  searchParams.set('limit', String(params?.limit ?? 10))

  return searchParams
}

async function createEquipment(
  payload: CreateBiometricEquipmentDTO,
): Promise<BiometricEquipment | void> {
  const response = await gpApi.post('biometrics/equipments', {
    json: payload,
  })

  return parseOptionalJson<BiometricEquipment>(response)
}

async function findAllEquipments(
  params?: BiometricEquipmentListParams,
): Promise<BiometricEquipmentListResponse> {
  return gpApi
    .get('biometrics/equipments', {
      searchParams: buildPaginationSearchParams(params),
    })
    .json<BiometricEquipmentListResponse>()
}

async function findOneEquipment(id: string): Promise<BiometricEquipment> {
  return gpApi.get(`biometrics/equipments/${id}`).json<BiometricEquipment>()
}

async function updateEquipment(
  id: string,
  payload: UpdateBiometricEquipmentDTO,
): Promise<BiometricEquipment | void> {
  const response = await gpApi.patch(`biometrics/equipments/${id}`, {
    json: payload,
  })

  return parseOptionalJson<BiometricEquipment>(response)
}

async function createIntegration(
  payload: CreateBiometricIntegrationDTO,
): Promise<BiometricIntegration | void> {
  const response = await gpApi.post('biometrics/integrations', {
    json: payload,
  })

  return parseOptionalJson<BiometricIntegration>(response)
}

async function findAllIntegrations(
  params?: BiometricIntegrationListParams,
): Promise<BiometricIntegrationListResponse> {
  return gpApi
    .get('biometrics/integrations', {
      searchParams: buildPaginationSearchParams(params),
    })
    .json<BiometricIntegrationListResponse>()
}

async function findIntegrationsByEmployee(
  employeeId: string,
): Promise<BiometricIntegration[]> {
  return gpApi
    .get(`biometrics/integrations/employee/${employeeId}`)
    .json<BiometricIntegration[]>()
}

export const biometricsService = {
  createEquipment,
  findAllEquipments,
  findOneEquipment,
  updateEquipment,
  createIntegration,
  findAllIntegrations,
  findIntegrationsByEmployee,
}
