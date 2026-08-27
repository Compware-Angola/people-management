'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'

export const salaryProcessingFormSchema = z
  .object({
    startDate: z.string().min(1, 'Data de início é obrigatória'),
    endDate: z.string().min(1, 'Data de fim é obrigatória'),
  })
  .refine((values) => new Date(values.endDate) >= new Date(values.startDate), {
    message: 'Data de fim deve ser posterior ou igual à data de início',
    path: ['endDate'],
  })

export type SalaryProcessingFormValues = z.infer<
  typeof salaryProcessingFormSchema
>

const defaultValues: SalaryProcessingFormValues = {
  startDate: '',
  endDate: '',
}

interface UseSalaryProcessingFormModalProps {
  open: boolean
  onSave: (values: SalaryProcessingFormValues) => Promise<void>
}

export function useSalaryProcessingFormModal({
  open,
  onSave,
}: UseSalaryProcessingFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: salaryProcessingFormSchema,
      onSubmit: salaryProcessingFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    form.reset(defaultValues)
  }, [open, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
