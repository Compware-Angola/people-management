import { gpApi } from '@/lib/api/gp.api'
import type {
  AnalyzeRequisitionFinancialDTO,
  AnalyzeRequisitionRhDTO,
  CancelRequisitionDTO,
  CreateRequisitionDTO,
  Requisition,
  RequisitionsListParams,
  RequisitionsListResponse,
  UpdateRequisitionDTO,
} from './requisitions.types'

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

function buildSearchParams(params?: RequisitionsListParams) {
  const searchParams = new URLSearchParams()

  searchParams.set('page', String(params?.page ?? 1))
  searchParams.set('limit', String(params?.limit ?? 10))

  if (params?.search) {
    searchParams.set('search', params.search)
  }

  if (params?.requesterName) {
    searchParams.set('requesterName', params.requesterName)
  }

  if (params?.requesterId) {
    searchParams.set('requesterId', String(params.requesterId))
  }

  if (params?.departmentId) {
    searchParams.set('departmentId', String(params.departmentId))
  }

  if (params?.costCenterId) {
    searchParams.set('costCenterId', String(params.costCenterId))
  }

  if (params?.positionId) {
    searchParams.set('positionId', String(params.positionId))
  }

  if (params?.hiringTypeId) {
    searchParams.set('hiringTypeId', String(params.hiringTypeId))
  }

  if (params?.stateId) {
    searchParams.set('stateId', String(params.stateId))
  }

  if (params?.startDate) {
    searchParams.set('startDate', params.startDate)
  }

  if (params?.endDate) {
    searchParams.set('endDate', params.endDate)
  }

  return searchParams
}

async function create(
  payload: CreateRequisitionDTO,
): Promise<Requisition | void> {
  const response = await gpApi.post('requisitions', { json: payload })

  return parseOptionalJson<Requisition>(response)
}

async function findAll(
  params?: RequisitionsListParams,
): Promise<RequisitionsListResponse> {
  return gpApi
    .get('requisitions', {
      searchParams: buildSearchParams(params),
    })
    .json<RequisitionsListResponse>()
}

async function findOne(code: string): Promise<Requisition> {
  return gpApi.get(`requisitions/${code}`).json<Requisition>()
}

async function update(
  code: string,
  payload: UpdateRequisitionDTO,
): Promise<Requisition | void> {
  const response = await gpApi.patch(`requisitions/${code}`, { json: payload })

  return parseOptionalJson<Requisition>(response)
}

async function remove(code: string): Promise<void> {
  await gpApi.delete(`requisitions/${code}`)
}

async function send(code: string): Promise<Requisition | void> {
  const response = await gpApi.post(`requisitions/${code}/send`)

  return parseOptionalJson<Requisition>(response)
}

async function cancel(
  code: string,
  payload: CancelRequisitionDTO,
): Promise<Requisition | void> {
  const response = await gpApi.post(`requisitions/${code}/cancel`, {
    json: payload,
  })

  return parseOptionalJson<Requisition>(response)
}

async function analyzeRh(
  code: string,
  payload: AnalyzeRequisitionRhDTO,
): Promise<Requisition | void> {
  const response = await gpApi.post(`requisitions/${code}/analyze/rh`, {
    json: payload,
  })

  return parseOptionalJson<Requisition>(response)
}

async function analyzeFinancial(
  code: string,
  payload: AnalyzeRequisitionFinancialDTO,
): Promise<Requisition | void> {
  const response = await gpApi.post(`requisitions/${code}/analyze/financial`, {
    json: payload,
  })

  return parseOptionalJson<Requisition>(response)
}

export const requisitionsService = {
  create,
  findAll,
  findOne,
  update,
  remove,
  send,
  cancel,
  analyzeRh,
  analyzeFinancial,
}
