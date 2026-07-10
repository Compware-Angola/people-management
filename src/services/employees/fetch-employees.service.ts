import { axiosApi } from '@/lib/axios-api'

export type Employee = {
  id: number
  name: string
  bi: string
  nif?: string | null
  phone: string
  alternativePhone?: string | null
  province: string
  municipality: string
  address: string
  email: string
  bank: string
  iban: string
  accountHolder: string
  currency: string
  status: number
  createdAt: string
}

export type EmployeesPaginationParams = {
  page?: number
  limit?: number
}

export type FetchEmployeesResponse = {
  data: Employee[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function fetchEmployees(
  params: EmployeesPaginationParams = {},
): Promise<FetchEmployeesResponse> {
  const { data } = await axiosApi.get<FetchEmployeesResponse>('/employees', {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    },
  })

  return data
}
