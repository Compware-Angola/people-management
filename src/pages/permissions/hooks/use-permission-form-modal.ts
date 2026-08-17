'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { Permission } from '@/services/permissions/permissions.types'

export const permissionFormSchema = z.object({
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(150, 'Descrição deve ter no máximo 150 caracteres'),
  status: z.enum(['0', '1']),
})

export type PermissionFormValues = z.infer<typeof permissionFormSchema>

const defaultValues: PermissionFormValues = {
  description: '',
  status: '1',
}

interface UsePermissionFormModalProps {
  open: boolean
  permission?: Permission | null
  onSave: (values: PermissionFormValues) => Promise<void>
}

export function usePermissionFormModal({
  open,
  permission,
  onSave,
}: UsePermissionFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: permissionFormSchema,
      onSubmit: permissionFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    if (permission) {
      form.reset({
        description: permission.description,
        status: String(permission.status) as PermissionFormValues['status'],
      })
    } else {
      form.reset(defaultValues)
    }
  }, [open, permission, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
