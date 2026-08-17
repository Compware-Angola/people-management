import { gpApi } from '@/lib/api/gp.api'
import { buildSearchParams } from '@/lib/api/build-search-params'
import { parseOptionalJson } from '@/lib/api/parse-optional-json'
import type {
  CreateVacancyDTO,
  UpdateVacancyDTO,
  UploadVacancyDocumentDTO,
  VacanciesListParams,
  VacanciesListResponse,
  Vacancy,
  VacancyActionDTO,
} from './vacancies.types'

async function create(payload: CreateVacancyDTO): Promise<Vacancy | void> {
  const response = await gpApi.post('vacancies', { json: payload })

  return parseOptionalJson<Vacancy>(response)
}

async function findAll(
  params?: VacanciesListParams,
): Promise<VacanciesListResponse> {
  return gpApi
    .get('vacancies', {
      searchParams: buildSearchParams({
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search,
        positionId: params?.positionId,
        departmentId: params?.departmentId,
        hiringTypeId: params?.hiringTypeId,
        stateId: params?.stateId,
        publicationStart: params?.publicationStart,
        publicationEnd: params?.publicationEnd,
        closingStart: params?.closingStart,
        closingEnd: params?.closingEnd,
      }),
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
