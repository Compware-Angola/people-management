'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import { ibanSchema, biSchema, nifSchema } from '@/lib/zod/schemas'
import type { Employee } from '@/services/employees/employees.types'

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
  bank: z.string().min(1, 'Banco é obrigatório'),
  iban: ibanSchema,
  accountHolder: z.string().min(1, 'Titular da conta é obrigatório'),
  currency: z.string(),
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
  bank: '',
  iban: '',
  accountHolder: '',
  currency: 'AOA',
  status: 1,
}

interface UseEmployeeFormModalProps {
  employee?: Employee | null
  onSave: (values: EmployeeFormValues) => Promise<void>
}

export function useEmployeeFormModal({
  employee,
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
    if (employee) {
      const { id: _id, createdAt: _createdAt, ...rest } = employee
      form.reset(rest)
    } else {
      form.reset(defaultValues)
    }
  }, [employee, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}