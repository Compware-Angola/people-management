import { gpApi } from '@/lib/api/gp.api'
import type {
  RequisitionState,
  RequisitionStatesListParams,
  RequisitionStatesListResponse,
} from './requisition-states.types'

function buildSearchParams(params?: RequisitionStatesListParams) {
  const searchParams = new URLSearchParams()

  searchParams.set('page', String(params?.page ?? 1))
  searchParams.set('limit', String(params?.limit ?? 10))

  if (params?.search) {
    searchParams.set('search', params.search)
  }

  if (params?.acronym) {
    searchParams.set('acronym', params.acronym)
  }

  if (params?.code) {
    searchParams.set('code', String(params.code))
  }

  return searchParams
}

async function findAll(
  params?: RequisitionStatesListParams,
): Promise<RequisitionStatesListResponse> {
  return gpApi
    .get('requisition-states', {
      searchParams: buildSearchParams(params),
    })
    .json<RequisitionStatesListResponse>()
}

async function findOne(code: number): Promise<RequisitionState> {
  return gpApi.get(`requisition-states/${code}`).json<RequisitionState>()
}

export const requisitionStatesService = {
  findAll,
  findOne,
}
