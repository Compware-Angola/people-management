import { gpApi } from '@/lib/api/gp.api'
import type {
  CreateLeaveDTO,
  Leave,
  LeaveListParams,
  LeaveListResponse,
  UpdateLeaveDTO,
} from './leaves.types'

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

function buildSearchParams(params?: LeaveListParams) {
  const searchParams = new URLSearchParams()

  searchParams.set('page', String(params?.page ?? 1))
  searchParams.set('limit', String(params?.limit ?? 10))

  if (params?.employeeId) {
    searchParams.set('employeeId', String(params.employeeId))
  }

  if (params?.type) {
    searchParams.set('type', params.type)
  }

  if (params?.status) {
    searchParams.set('status', params.status)
  }

  if (params?.startDate) {
    searchParams.set('startDate', params.startDate)
  }

  if (params?.endDate) {
    searchParams.set('endDate', params.endDate)
  }

  return searchParams
}

async function create(payload: CreateLeaveDTO): Promise<Leave | void> {
  const response = await gpApi.post('leaves', { json: payload })

  return parseOptionalJson<Leave>(response)
}

async function findAll(
  params?: LeaveListParams,
): Promise<LeaveListResponse> {
  return gpApi
    .get('leaves', {
      searchParams: buildSearchParams(params),
    })
    .json<LeaveListResponse>()
}

async function update(
  id: string,
  payload: UpdateLeaveDTO,
): Promise<Leave | void> {
  const response = await gpApi.patch(`leaves/${id}`, { json: payload })

  return parseOptionalJson<Leave>(response)
}

export const leavesService = {
  create,
  findAll,
  update,
}
