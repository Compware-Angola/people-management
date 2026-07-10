import { useQuery } from '@tanstack/react-query'

import { fetchEmployees } from '@/services/employees/fetch-employees.service'
import type { EmployeesPaginationParams } from '@/services/employees/fetch-employees.service'

export const employeesQueryKey = (params: EmployeesPaginationParams = {}) => [
  'employees',
  params,
]

export function useQueryEmployees(params: EmployeesPaginationParams = {}) {
  return useQuery({
    queryKey: employeesQueryKey(params),
    queryFn: () => fetchEmployees(params),
  })
}
