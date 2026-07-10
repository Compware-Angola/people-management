import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createEmployee } from '@/services/employees/create-employee.service'
import type { CreateEmployeePayload } from '@/services/employees/create-employee.service'

export function useMutationCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => createEmployee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}
