import { gpApi } from '@/lib/api/gp.api'
import type {
  CreateVacancyDTO,
  UpdateVacancyDTO,
  UploadVacancyDocumentDTO,
  VacanciesListParams,
  VacanciesListResponse,
  Vacancy,
  VacancyActionDTO,
} from './vacancies.types'

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

function buildSearchParams(params?: VacanciesListParams) {
  const searchParams = new URLSearchParams()

  searchParams.set('page', String(params?.page ?? 1))
  searchParams.set('limit', String(params?.limit ?? 10))

  if (params?.search) {
    searchParams.set('search', params.search)
  }

  if (params?.positionId) {
    searchParams.set('positionId', String(params.positionId))
  }

  if (params?.departmentId) {
    searchParams.set('departmentId', String(params.departmentId))
  }

  if (params?.hiringTypeId) {
    searchParams.set('hiringTypeId', String(params.hiringTypeId))
  }

  if (params?.stateId) {
    searchParams.set('stateId', String(params.stateId))
  }

  if (params?.publicationStart) {
    searchParams.set('publicationStart', params.publicationStart)
  }

  if (params?.publicationEnd) {
    searchParams.set('publicationEnd', params.publicationEnd)
  }

  if (params?.closingStart) {
    searchParams.set('closingStart', params.closingStart)
  }

  if (params?.closingEnd) {
    searchParams.set('closingEnd', params.closingEnd)
  }

  return searchParams
}

async function create(payload: CreateVacancyDTO): Promise<Vacancy | void> {
  const response = await gpApi.post('vacancies', { json: payload })

  return parseOptionalJson<Vacancy>(response)
}

async function findAll(
  params?: VacanciesListParams,
): Promise<VacanciesListResponse> {
  return gpApi
    .get('vacancies', {
      searchParams: buildSearchParams(params),
    })
    .json<VacanciesListResponse>()
}

async function findOne(code: string): Promise<Vacancy> {
  return gpApi.get(`vacancies/${code}`).json<Vacancy>()
}

async function update(
  code: string,
  payload: UpdateVacancyDTO,
): Promise<Vacancy | void> {
  const response = await gpApi.patch(`vacancies/${code}`, { json: payload })

  return parseOptionalJson<Vacancy>(response)
}

async function uploadDocument(
  code: string,
  payload: UploadVacancyDocumentDTO,
): Promise<Vacancy | void> {
  const formData = new FormData()
  formData.append('file', payload.file)
  formData.append('type', payload.type)

  if (payload.description) {
    formData.append('description', payload.description)
  }

  const response = await gpApi.post(`vacancies/${code}/documents`, {
    body: formData,
  })

  return parseOptionalJson<Vacancy>(response)
}

async function publish(code: string): Promise<Vacancy | void> {
  const response = await gpApi.post(`vacancies/${code}/publish`)

  return parseOptionalJson<Vacancy>(response)
}

async function suspend(
  code: string,
  payload: VacancyActionDTO,
): Promise<Vacancy | void> {
  const response = await gpApi.post(`vacancies/${code}/suspend`, {
    json: payload,
  })

  return parseOptionalJson<Vacancy>(response)
}

async function reactivate(code: string): Promise<Vacancy | void> {
  const response = await gpApi.post(`vacancies/${code}/reactivate`)

  return parseOptionalJson<Vacancy>(response)
}

async function close(
  code: string,
  payload: VacancyActionDTO,
): Promise<Vacancy | void> {
  const response = await gpApi.post(`vacancies/${code}/close`, {
    json: payload,
  })

  return parseOptionalJson<Vacancy>(response)
}

async function cancel(
  code: string,
  payload: VacancyActionDTO,
): Promise<Vacancy | void> {
  const response = await gpApi.post(`vacancies/${code}/cancel`, {
    json: payload,
  })

  return parseOptionalJson<Vacancy>(response)
}

export const vacanciesService = {
  create,
  findAll,
  findOne,
  update,
  uploadDocument,
  publish,
  suspend,
  reactivate,
  close,
  cancel,
}
