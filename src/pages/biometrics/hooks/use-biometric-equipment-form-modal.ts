'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { BiometricEquipment } from '@/services/biometrics/biometrics.types'

export const biometricEquipmentFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  location: z.string().optional(),
  model: z.string().optional(),
  status: z.enum(['0', '1']),
})

export type BiometricEquipmentFormValues = z.infer<
  typeof biometricEquipmentFormSchema
>

const defaultValues: BiometricEquipmentFormValues = {
  name: '',
  location: '',
  model: '',
  status: '1',
}

interface UseBiometricEquipmentFormModalProps {
  open: boolean
  equipment?: BiometricEquipment | null
  onSave: (values: BiometricEquipmentFormValues) => Promise<void>
}

export function useBiometricEquipmentFormModal({
  open,
  equipment,
  onSave,
}: UseBiometricEquipmentFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: biometricEquipmentFormSchema,
      onSubmit: biometricEquipmentFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    if (equipment) {
      form.reset({
        name: equipment.name,
        location: equipment.location ?? '',
        model: equipment.model ?? '',
        status: String(equipment.status) === '0' ? '0' : '1',
      })
    } else {
      form.reset(defaultValues)
    }
  }, [open, equipment, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
