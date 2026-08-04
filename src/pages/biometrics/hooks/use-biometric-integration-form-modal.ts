'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'

export const biometricIntegrationFormSchema = z.object({
  employeeId: z.string().min(1, 'Colaborador é obrigatório'),
  equipmentId: z.string().min(1, 'Equipamento é obrigatório'),
  event: z.enum(['ENTRADA', 'SAIDA', 'INTERVALO']),
  status: z.enum(['0', '1']),
})

export type BiometricIntegrationFormValues = z.infer<
  typeof biometricIntegrationFormSchema
>

const defaultValues: BiometricIntegrationFormValues = {
  employeeId: '',
  equipmentId: '',
  event: 'ENTRADA',
  status: '1',
}

interface UseBiometricIntegrationFormModalProps {
  open: boolean
  onSave: (values: BiometricIntegrationFormValues) => Promise<void>
}

export function useBiometricIntegrationFormModal({
  open,
  onSave,
}: UseBiometricIntegrationFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: biometricIntegrationFormSchema,
      onSubmit: biometricIntegrationFormSchema,
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
