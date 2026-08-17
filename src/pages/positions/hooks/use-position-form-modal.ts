'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { Position } from '@/services/positions/positions.types'

export const positionFormSchema = z.object({
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(150, 'Descrição deve ter no máximo 150 caracteres'),
  status: z.enum(['0', '1']),
})

export type PositionFormValues = z.infer<typeof positionFormSchema>

const defaultValues: PositionFormValues = {
  description: '',
  status: '1',
}

interface UsePositionFormModalProps {
  open: boolean
  position?: Position | null
  onSave: (values: PositionFormValues) => Promise<void>
}

export function usePositionFormModal({
  open,
  position,
  onSave,
}: UsePositionFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: positionFormSchema,
      onSubmit: positionFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    if (position) {
      form.reset({
        description: position.description,
        status: String(position.status) as PositionFormValues['status'],
      })
    } else {
      form.reset(defaultValues)
    }
  }, [open, position, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
