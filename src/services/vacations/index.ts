import { gpApi } from '@/lib/api/gp.api'
import type {
  CreateVacationDTO,
  UpdateVacationDTO,
  Vacation,
  VacationListParams,
  VacationListResponse,
} from './vacations.types'

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

function buildSearchParams(params?: VacationListParams) {
  const searchParams = new URLSearchParams()

  searchParams.set('page', String(params?.page ?? 1))
  searchParams.set('limit', String(params?.limit ?? 10))

  if (params?.employeeId) {
    searchParams.set('employeeId', String(params.employeeId))
  }

  if (params?.status) {
    searchParams.set('status', params.status)
  }

  if (params?.approverManagerId) {
    searchParams.set('approverManagerId', String(params.approverManagerId))
  }

  if (params?.approverRhId) {
    searchParams.set('approverRhId', String(params.approverRhId))
  }

  if (params?.startDate) {
    searchParams.set('startDate', params.startDate)
  }

  if (params?.endDate) {
    searchParams.set('endDate', params.endDate)
  }

  return searchParams
}

async function create(payload: CreateVacationDTO): Promise<Vacation | void> {
  const response = await gpApi.post('vacations', { json: payload })

  return parseOptionalJson<Vacation>(response)
}

async function findAll(
  params?: VacationListParams,
): Promise<VacationListResponse> {
  return gpApi
    .get('vacations', {
      searchParams: buildSearchParams(params),
    })
    .json<VacationListResponse>()
}

async function findOne(id: string): Promise<Vacation> {
  return gpApi.get(`vacations/${id}`).json<Vacation>()
}

async function update(
  id: string,
  payload: UpdateVacationDTO,
): Promise<Vacation | void> {
  const response = await gpApi.patch(`vacations/${id}`, { json: payload })

  return parseOptionalJson<Vacation>(response)
}

async function remove(id: string): Promise<void> {
  await gpApi.delete(`vacations/${id}`)
}

export const vacationsService = {
  create,
  findAll,
  findOne,
  update,
  remove,
}
