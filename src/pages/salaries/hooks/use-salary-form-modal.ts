'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { Salary } from '@/services/salaries/salaries.types'

const MAX_BASE_SALARY = 99_999_999.99

export const salaryFormSchema = z.object({
  position: z
    .string()
    .min(1, 'Cargo é obrigatório')
    .max(150, 'Cargo deve ter no máximo 150 caracteres'),
  category: z
    .string()
    .min(1, 'Categoria é obrigatória')
    .max(100, 'Categoria deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(255, 'Descrição deve ter no máximo 255 caracteres')
    .optional(),
  baseSalary: z
    .string()
    .min(1, 'Salário base é obrigatório')
    .refine((value) => Number(value) >= 0, {
      message: 'Salário base deve ser maior ou igual a zero',
    })
    .refine((value) => Number(value) <= MAX_BASE_SALARY, {
      message: 'Salário base não pode ser superior a 99.999.999,99',
    }),
  status: z.enum(['0', '1']),
})

export type SalaryFormValues = z.infer<typeof salaryFormSchema>

const defaultValues: SalaryFormValues = {
  position: '',
  category: '',
  description: '',
  baseSalary: '',
  status: '1',
}

interface UseSalaryFormModalProps {
  open: boolean
  salary?: Salary | null
  onSave: (values: SalaryFormValues) => Promise<void>
}

export function useSalaryFormModal({
  open,
  salary,
  onSave,
}: UseSalaryFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: salaryFormSchema,
      onSubmit: salaryFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    if (salary) {
      form.reset({
        position: salary.position,
        category: salary.category,
        description: salary.description ?? '',
        baseSalary: String(salary.baseSalary),
        status: String(salary.status) as SalaryFormValues['status'],
      })
    } else {
      form.reset(defaultValues)
    }
  }, [open, salary, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
