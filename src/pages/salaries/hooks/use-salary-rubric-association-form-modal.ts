'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { Salary } from '@/services/salaries/salaries.types'

export const salaryRubricAssociationFormSchema = z.object({
  rubricCode: z
    .string()
    .min(1, 'Código da rubrica é obrigatório')
    .refine((value) => Number(value) > 0, {
      message: 'Código da rubrica deve ser maior que zero',
    }),
})

export type SalaryRubricAssociationFormValues = z.infer<
  typeof salaryRubricAssociationFormSchema
>

const defaultValues: SalaryRubricAssociationFormValues = {
  rubricCode: '',
}

interface UseSalaryRubricAssociationFormModalProps {
  open: boolean
  salary?: Salary | null
  onSave: (values: SalaryRubricAssociationFormValues) => Promise<void>
}

export function useSalaryRubricAssociationFormModal({
  open,
  salary,
  onSave,
}: UseSalaryRubricAssociationFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: salaryRubricAssociationFormSchema,
      onSubmit: salaryRubricAssociationFormSchema,
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
