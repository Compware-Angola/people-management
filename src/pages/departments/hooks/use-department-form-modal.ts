'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { Department } from '@/services/departments/departments.types'

export const departmentFormSchema = z.object({
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(150, 'Descrição deve ter no máximo 150 caracteres'),
  status: z.enum(['0', '1']),
})

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>

const defaultValues: DepartmentFormValues = {
  description: '',
  status: '1',
}

interface UseDepartmentFormModalProps {
  open: boolean
  department?: Department | null
  onSave: (values: DepartmentFormValues) => Promise<void>
}

export function useDepartmentFormModal({
  open,
  department,
  onSave,
}: UseDepartmentFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: departmentFormSchema,
      onSubmit: departmentFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    if (department) {
      form.reset({
        description: department.description,
        status: String(department.status) as DepartmentFormValues['status'],
      })
    } else {
      form.reset(defaultValues)
    }
  }, [open, department, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
