import { axiosApi } from '@/lib/axios-api'

export type CreateEmployeePayload = {
  name: string
  bi: string
  nif?: string
  phone: string
  alternativePhone?: string
  province: string
  municipality: string
  address: string
  email: string
  bank: string
  iban: string
  accountHolder: string
  currency: string
  status?: number
}

export async function createEmployee(
  payload: CreateEmployeePayload,
): Promise<void> {
  await axiosApi.post('/employees', payload)
}
