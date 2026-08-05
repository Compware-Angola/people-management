'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { Leave } from '@/services/leaves/leaves.types'

export const leaveStatusSchema = z
  .object({
    status: z.enum(['PENDENTE', 'APROVADA', 'REJEITADA', 'CANCELADA']),
    observation: z.string().optional(),
  })
  .refine(
    (value) => {
      if (value.status !== 'REJEITADA' && value.status !== 'CANCELADA') {
        return true
      }

      return Boolean(value.observation?.trim())
    },
    {
      message: 'Observação é obrigatória para rejeitar ou cancelar',
      path: ['observation'],
    },
  )

export type LeaveStatusFormValues = z.infer<typeof leaveStatusSchema>

const defaultValues: LeaveStatusFormValues = {
  status: 'PENDENTE',
  observation: '',
}

type UseLeaveStatusModalProps = {
  open: boolean
  leave?: Leave | null
  onSave: (values: LeaveStatusFormValues) => Promise<void>
}

export function useLeaveStatusModal({
  open,
  leave,
  onSave,
}: UseLeaveStatusModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: leaveStatusSchema,
      onSubmit: leaveStatusSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    if (leave) {
      form.reset({
        status: leave.status,
        observation: leave.observation ?? '',
      })
    } else {
      form.reset(defaultValues)
    }
  }, [open, leave, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
