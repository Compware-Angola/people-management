'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { PermissionGroup } from '@/services/permissions/permissions.types'

export const permissionGroupFormSchema = z.object({
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(150, 'Descrição deve ter no máximo 150 caracteres'),
  departmentId: z.string(),
  status: z.enum(['0', '1']),
})

export type PermissionGroupFormValues = z.infer<
  typeof permissionGroupFormSchema
>

const defaultValues: PermissionGroupFormValues = {
  description: '',
  departmentId: 'none',
  status: '1',
}

interface UsePermissionGroupFormModalProps {
  open: boolean
  group?: PermissionGroup | null
  onSave: (values: PermissionGroupFormValues) => Promise<void>
}

export function usePermissionGroupFormModal({
  open,
  group,
  onSave,
}: UsePermissionGroupFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: permissionGroupFormSchema,
      onSubmit: permissionGroupFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    if (group) {
      form.reset({
        description: group.description,
        departmentId: group.departmentId ? String(group.departmentId) : 'none',
        status: String(group.status) as PermissionGroupFormValues['status'],
      })
    } else {
      form.reset(defaultValues)
    }
  }, [open, group, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
