import type { Department } from '@/services/departments/departments.types'
import type { HiringType } from '@/services/hiring-types/hiring-types.types'
import type { Position } from '@/services/positions/positions.types'
import type { Requisition } from '@/services/requisitions/requisitions.types'
import type {
  VacancyState,
  VacancyStateAcronym,
} from '@/services/vacancy-states/vacancy-states.types'

export type VacancyUser = {
  code?: number
  id?: number
  name?: string
  nome?: string
  email?: string
}

export type VacancyDocumentType = 'EDITAL' | 'OUTRO'

export type VacancyDocument = {
  code: number
  vacancyId: number
  type: VacancyDocumentType | string
  path: string
  originalName: string
  description: string | null
  uploadedBy: number
  uploadedByUser?: VacancyUser
  createdAt: string
}

export type VacancyHistory = {
  code: number
  vacancyId: number
  action: string
  responsibleId: number
  responsible?: VacancyUser
  date: string
  observation: string | null
  justification: string | null
}

export type Vacancy = {
  code: number
  vacancyCode: string
  requisitionId: number
  requisition?: Requisition
  positionId: number
  position?: Position
  departmentId: number
  department?: Department
  hiringTypeId: number
  hiringType?: HiringType
  numberOfVacancies: number
  stateId: number
  state?: VacancyState
  publicationDate: string | null
  closingDate: string | null
  justification: string | null
  createdAt: string
  createdBy: number
  createdByUser?: VacancyUser
  updatedAt: string | null
  updatedBy: number | null
  publishedAt: string | null
  publishedBy: number | null
  suspendedAt: string | null
  suspendedBy: number | null
  closedAt: string | null
  closedBy: number | null
  cancelledAt: string | null
  cancelledBy: number | null
  documents?: VacancyDocument[]
  history?: VacancyHistory[]
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type VacanciesListResponse = {
  data: Vacancy[]
  meta: PaginationMeta
}

export type VacanciesListParams = {
  page?: number
  limit?: number
  search?: string
  positionId?: number
  departmentId?: number
  hiringTypeId?: number
  stateId?: number
  publicationStart?: string
  publicationEnd?: string
  closingStart?: string
  closingEnd?: string
}

export type CreateVacancyDTO = {
  requisitionId: number
  numberOfVacancies?: number
  publicationDate?: string
  closingDate?: string
}

export type UpdateVacancyDTO = {
  numberOfVacancies?: number
  publicationDate?: string
  closingDate?: string
}

export type VacancyActionDTO = {
  justification: string
  observation?: string
}

export type UploadVacancyDocumentDTO = {
  key: string
  originalName: string
  type: VacancyDocumentType
  description?: string
}

export type VacancyStateValue = VacancyStateAcronym | string
