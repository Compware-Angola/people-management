'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'

const MAX_RUBRIC_VALUE = 99_999_999.99

export const rubricFormSchema = z.object({
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(255, 'Descrição deve ter no máximo 255 caracteres'),
  type: z.enum(['PROVENTO', 'DESCONTO']),
  valueType: z.enum(['PERCENTUAL', 'FIXO', 'HORA_EXTRA']),
  value: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine((value) => Number(value) >= 0, {
      message: 'Valor deve ser maior ou igual a zero',
    })
    .refine((value) => Number(value) <= MAX_RUBRIC_VALUE, {
      message: 'Valor não pode ser superior a 99.999.999,99',
    }),
  status: z.enum(['0', '1']),
})

export type RubricFormValues = z.infer<typeof rubricFormSchema>

const defaultValues: RubricFormValues = {
  description: '',
  type: 'PROVENTO',
  valueType: 'FIXO',
  value: '',
  status: '1',
}

interface UseRubricFormModalProps {
  open: boolean
  onSave: (values: RubricFormValues) => Promise<void>
}

export function useRubricFormModal({
  open,
  onSave,
}: UseRubricFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: rubricFormSchema,
      onSubmit: rubricFormSchema,
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
