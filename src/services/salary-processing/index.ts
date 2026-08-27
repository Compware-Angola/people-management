import { gpApi } from '@/lib/api/gp.api'
import { buildSearchParams } from '@/lib/api/build-search-params'
import { parseOptionalJson } from '@/lib/api/parse-optional-json'
import type {
  CreateSalaryProcessingDTO,
  SalaryProcessing,
  SalaryProcessingDetails,
  SalaryProcessingListParams,
  SalaryProcessingListResponse,
  ValidateSalaryProcessingDTO,
} from './salary-processing.types'

async function create(
  payload: CreateSalaryProcessingDTO,
): Promise<SalaryProcessing | void> {
  const response = await gpApi.post('salary-processing', { json: payload })

  return parseOptionalJson<SalaryProcessing>(response)
}

async function findAll(
  params?: SalaryProcessingListParams,
): Promise<SalaryProcessingListResponse> {
  return gpApi
    .get('salary-processing', {
      searchParams: buildSearchParams({
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        id: params?.id,
        status: params?.status,
        responsibleEmployeeId: params?.responsibleEmployeeId,
        startDate: params?.startDate,
        endDate: params?.endDate,
      }),
    })
    .json<SalaryProcessingListResponse>()
}

async function findOne(id: number): Promise<SalaryProcessingDetails> {
  return gpApi.get(`salary-processing/${id}`).json<SalaryProcessingDetails>()
}

async function validate(
  id: number,
  payload: ValidateSalaryProcessingDTO,
): Promise<SalaryProcessing | void> {
  const response = await gpApi.patch(`salary-processing/${id}/validate`, {
    json: payload,
  })

  return parseOptionalJson<SalaryProcessing>(response)
}

async function reprocess(id: number): Promise<SalaryProcessing | void> {
  const response = await gpApi.post(`salary-processing/${id}/reprocess`)

  return parseOptionalJson<SalaryProcessing>(response)
}

export const salaryProcessingService = {
  create,
  findAll,
  findOne,
  validate,
  reprocess,
}
