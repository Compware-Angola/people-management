'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { HiringType } from '@/services/hiring-types/hiring-types.types'

export const hiringTypeFormSchema = z.object({
  acronym: z
    .string()
    .min(1, 'Sigla é obrigatória')
    .max(20, 'Sigla deve ter no máximo 20 caracteres'),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(150, 'Descrição deve ter no máximo 150 caracteres'),
  status: z.enum(['0', '1']),
})

export type HiringTypeFormValues = z.infer<typeof hiringTypeFormSchema>

const defaultValues: HiringTypeFormValues = {
  acronym: '',
  description: '',
  status: '1',
}

interface UseHiringTypeFormModalProps {
  open: boolean
  hiringType?: HiringType | null
  onSave: (values: HiringTypeFormValues) => Promise<void>
}

export function useHiringTypeFormModal({
  open,
  hiringType,
  onSave,
}: UseHiringTypeFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: hiringTypeFormSchema,
      onSubmit: hiringTypeFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    if (hiringType) {
      form.reset({
        acronym: hiringType.acronym,
        description: hiringType.description,
        status: String(hiringType.status) as HiringTypeFormValues['status'],
      })
    } else {
      form.reset(defaultValues)
    }
  }, [open, hiringType, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
