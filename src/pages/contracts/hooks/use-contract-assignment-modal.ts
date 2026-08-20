'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'

export const contractAssignmentFormSchema = z.object({
  employeeId: z.string().min(1, 'Colaborador é obrigatório'),
})

export type ContractAssignmentFormValues = z.infer<
  typeof contractAssignmentFormSchema
>

const defaultValues: ContractAssignmentFormValues = {
  employeeId: '',
}

interface UseContractAssignmentModalProps {
  open: boolean
  onSave: (values: ContractAssignmentFormValues) => Promise<void>
}

export function useContractAssignmentModal({
  open,
  onSave,
}: UseContractAssignmentModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: contractAssignmentFormSchema,
      onSubmit: contractAssignmentFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
    }
  }, [open, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
