'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import { biSchema, nifSchema } from '@/lib/zod/schemas'
import type { User } from '@/services/users/users.types'

export const employeeSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  bi: biSchema,
  nif: nifSchema,
  phone: z.string().min(1, 'Telefone é obrigatório'),
  alternativePhone: z.string().nullable(),
  province: z.string().min(1, 'Província é obrigatória'),
  municipality: z.string().min(1, 'Município é obrigatório'),
  address: z.string().min(1, 'Morada é obrigatória'),
  email: z.email('Email inválido').min(1, 'Email é obrigatório'),
  status: z.number(),
})

export type EmployeeFormValues = z.infer<typeof employeeSchema>

const defaultValues: EmployeeFormValues = {
  name: '',
  bi: '',
  nif: '',
  phone: '',
  alternativePhone: null,
  province: '',
  municipality: '',
  address: '',
  email: '',
  status: 1,
}

interface UseEmployeeFormModalProps {
  user?: User | null
  onSave: (values: EmployeeFormValues) => Promise<void>
}

export function useEmployeeFormModal({
  user,
  onSave,
}: UseEmployeeFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: employeeSchema,
      onSubmit: employeeSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        bi: user.bi,
        nif: user.nif ?? '',
        phone: user.phone,
        alternativePhone: user.alternativePhone ?? null,
        province: user.province,
        municipality: user.municipality,
        address: user.address,
        email: user.email,
        status: user.status,
      })
    } else {
      form.reset(defaultValues)
    }
  }, [user, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
