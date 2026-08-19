'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { Salary } from '@/services/salaries/salaries.types'

export const salaryAssignmentFormSchema = z.object({
  employeeId: z.string().min(1, 'Colaborador é obrigatório'),
})

export type SalaryAssignmentFormValues = z.infer<
  typeof salaryAssignmentFormSchema
>

const defaultValues: SalaryAssignmentFormValues = {
  employeeId: '',
}

interface UseSalaryAssignmentFormModalProps {
  open: boolean
  salary?: Salary | null
  onSave: (values: SalaryAssignmentFormValues) => Promise<void>
}

export function useSalaryAssignmentFormModal({
  open,
  salary,
  onSave,
}: UseSalaryAssignmentFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: salaryAssignmentFormSchema,
      onSubmit: salaryAssignmentFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open || !salary) return

    form.reset(defaultValues)
  }, [open, salary, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
