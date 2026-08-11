'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { CostCenter } from '@/services/cost-centers/cost-centers.types'

export const costCenterFormSchema = z.object({
  departmentId: z.string().min(1, 'Departamento é obrigatório'),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(150, 'Descrição deve ter no máximo 150 caracteres'),
  status: z.enum(['0', '1']),
})

export type CostCenterFormValues = z.infer<typeof costCenterFormSchema>

const defaultValues: CostCenterFormValues = {
  departmentId: '',
  description: '',
  status: '1',
}

interface UseCostCenterFormModalProps {
  open: boolean
  costCenter?: CostCenter | null
  onSave: (values: CostCenterFormValues) => Promise<void>
}

export function useCostCenterFormModal({
  open,
  costCenter,
  onSave,
}: UseCostCenterFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: costCenterFormSchema,
      onSubmit: costCenterFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    if (costCenter) {
      form.reset({
        departmentId: String(costCenter.departmentId),
        description: costCenter.description,
        status: String(costCenter.status) as CostCenterFormValues['status'],
      })
    } else {
      form.reset(defaultValues)
    }
  }, [open, costCenter, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
