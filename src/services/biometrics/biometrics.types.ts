export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type BiometricEquipment = {
  id: number
  name: string
  location?: string | null
  model?: string | null
  status: number
  createdAt: string
}

export type BiometricEquipmentListResponse = {
  data: BiometricEquipment[]
  meta: PaginationMeta
}

export type BiometricEquipmentListParams = {
  page?: number
  limit?: number
}

export type CreateBiometricEquipmentDTO = {
  name: string
  location?: string
  model?: string
  status?: number
}

export type UpdateBiometricEquipmentDTO =
  Partial<CreateBiometricEquipmentDTO>

export type BiometricEvent = 'ENTRADA' | 'SAIDA' | 'INTERVALO'

export type BiometricIntegration = {
  id: number
  employeeId: number
  employeeName?: string
  equipmentId: number
  equipmentName: string
  event: BiometricEvent
  status: number
  createdAt: string
}

export type BiometricIntegrationListResponse = {
  data: BiometricIntegration[]
  meta: PaginationMeta
}

export type BiometricIntegrationListParams = {
  page?: number
  limit?: number
}

export type CreateBiometricIntegrationDTO = {
  employeeId: number
  equipmentId: number
  event: BiometricEvent
  status?: number
}
