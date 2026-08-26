import { gpApi } from '@/lib/api/gp.api'
import { buildSearchParams } from '@/lib/api/build-search-params'
import { parseOptionalJson } from '@/lib/api/parse-optional-json'
import type {
  CreateRubricDTO,
  CreateSalaryDTO,
  CreateSalaryEmployeeDTO,
  CreateSalaryRubricDTO,
  Rubric,
  RubricListParams,
  RubricListResponse,
  Salary,
  SalaryEmployee,
  SalaryListParams,
  SalaryListResponse,
  SalaryWithRubrics,
  UpdateSalaryDTO,
} from './salaries.types'

async function create(payload: CreateSalaryDTO): Promise<Salary | void> {
  const response = await gpApi.post('salaries', { json: payload })

  return parseOptionalJson<Salary>(response)
}

async function findAll(
  params?: SalaryListParams,
): Promise<SalaryListResponse> {
  return gpApi
    .get('salaries', {
      searchParams: buildSearchParams({
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        id: params?.id,
        position: params?.position,
        category: params?.category,
      }),
    })
    .json<SalaryListResponse>()
}

async function update(
  id: number,
  payload: UpdateSalaryDTO,
): Promise<Salary | void> {
  const response = await gpApi.patch(`salaries/${id}`, { json: payload })

  return parseOptionalJson<Salary>(response)
}

async function assignToEmployee(
  payload: CreateSalaryEmployeeDTO,
): Promise<SalaryEmployee | void> {
  const response = await gpApi.post('salaries/employees', { json: payload })

  return parseOptionalJson<SalaryEmployee>(response)
}

async function findEmployeeSalary(employeeId: number): Promise<SalaryEmployee> {
  return gpApi.get(`salaries/employees/${employeeId}`).json<SalaryEmployee>()
}

async function findEmployeeSalaryHistory(
  employeeId: number,
): Promise<SalaryEmployee[]> {
  return gpApi
    .get(`salaries/employees/${employeeId}/history`)
    .json<SalaryEmployee[]>()
}

async function createRubric(payload: CreateRubricDTO): Promise<Rubric | void> {
  const response = await gpApi.post('salaries/rubrics', { json: payload })

  return parseOptionalJson<Rubric>(response)
}

async function findAllRubrics(
  params?: RubricListParams,
): Promise<RubricListResponse> {
  return gpApi
    .get('salaries/rubrics', {
      searchParams: buildSearchParams({
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        search: params?.search,
        type: params?.type,
        valueType: params?.valueType,
        status: params?.status,
      }),
    })
    .json<RubricListResponse>()
}

async function associateRubricToStructure(
  payload: CreateSalaryRubricDTO,
): Promise<void> {
  const response = await gpApi.post('salaries/rubrics/associate', {
    json: payload,
  })

  return parseOptionalJson<void>(response)
}

async function findSalaryStructureWithRubrics(
  id: number,
): Promise<SalaryWithRubrics> {
  return gpApi.get(`salaries/rubrics/${id}`).json<SalaryWithRubrics>()
}

export const salariesService = {
  create,
  findAll,
  update,
  assignToEmployee,
  findEmployeeSalary,
  findEmployeeSalaryHistory,
  createRubric,
  findAllRubrics,
  associateRubricToStructure,
  findSalaryStructureWithRubrics,
}
