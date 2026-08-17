import { gpApi } from '@/lib/api/gp.api'
import { buildSearchParams } from '@/lib/api/build-search-params'
import { parseOptionalJson } from '@/lib/api/parse-optional-json'
import type {
  CreateVacationDTO,
  UpdateVacationDTO,
  Vacation,
  VacationListParams,
  VacationListResponse,
} from './vacations.types'

async function create(payload: CreateVacationDTO): Promise<Vacation | void> {
  const response = await gpApi.post('vacations', { json: payload })

  return parseOptionalJson<Vacation>(response)
}

async function findAll(
  params?: VacationListParams,
): Promise<VacationListResponse> {
  return gpApi
    .get('vacations', {
      searchParams: buildSearchParams({
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        employeeId: params?.employeeId,
        status: params?.status,
        approverManagerId: params?.approverManagerId,
        approverRhId: params?.approverRhId,
        startDate: params?.startDate,
        endDate: params?.endDate,
      }),
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
