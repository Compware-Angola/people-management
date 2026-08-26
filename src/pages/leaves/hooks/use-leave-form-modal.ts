'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'

export const leaveFormSchema = z
  .object({
    employeeId: z.string().min(1, 'Colaborador é obrigatório'),
    type: z.enum(['MEDICA', 'MATERNIDADE', 'PATERNIDADE', 'ESTUDO']),
    startDate: z.string().min(1, 'Data de início é obrigatória'),
    endDate: z.string().min(1, 'Data de fim é obrigatória'),
    documentId: z.string().optional(),
    observation: z.string().optional(),
  })
  .refine(
    (value) => {
      if (!value.startDate || !value.endDate) return true

      return new Date(value.endDate) > new Date(value.startDate)
    },
    {
      message: 'Data de fim deve ser superior à data de início',
      path: ['endDate'],
    },
  )

export type LeaveFormValues = z.infer<typeof leaveFormSchema>

const defaultValues: LeaveFormValues = {
  employeeId: '',
  type: 'MEDICA',
  startDate: '',
  endDate: '',
  documentId: '',
  observation: '',
}

type UseLeaveFormModalProps = {
  open: boolean
  onSave: (values: LeaveFormValues) => Promise<void>
}

export function useLeaveFormModal({ open, onSave }: UseLeaveFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: leaveFormSchema,
      onSubmit: leaveFormSchema,
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
