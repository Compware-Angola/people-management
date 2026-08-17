import { gpApi } from '@/lib/api/gp.api'
import { buildSearchParams } from '@/lib/api/build-search-params'
import { parseOptionalJson } from '@/lib/api/parse-optional-json'
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
      searchParams: buildSearchParams({
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search,
        requesterName: params?.requesterName,
        requesterId: params?.requesterId,
        departmentId: params?.departmentId,
        costCenterId: params?.costCenterId,
        positionId: params?.positionId,
        hiringTypeId: params?.hiringTypeId,
        stateId: params?.stateId,
        startDate: params?.startDate,
        endDate: params?.endDate,
      }),
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
