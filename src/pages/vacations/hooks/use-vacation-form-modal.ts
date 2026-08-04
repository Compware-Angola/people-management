'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { Vacation } from '@/services/vacations/vacations.types'

export const vacationFormSchema = z
  .object({
    employeeId: z.string().min(1, 'Colaborador é obrigatório'),
    startDate: z.string().min(1, 'Data de início é obrigatória'),
    endDate: z.string().min(1, 'Data de fim é obrigatória'),
    days: z
      .string()
      .min(1, 'Número de dias é obrigatório')
      .refine((value) => Number(value) >= 1, {
        message: 'Número de dias deve ser maior ou igual a 1',
      }),
    observation: z.string().optional(),
    approverManagerId: z.string().optional(),
    approverRhId: z.string().optional(),
    status: z.enum(['PENDENTE', 'APROVADO', 'REPROVADO', 'CANCELADO']),
  })
  .refine(
    (value) => {
      if (!value.startDate || !value.endDate) return true

      return new Date(value.endDate) >= new Date(value.startDate)
    },
    {
      message: 'Data de fim deve ser maior ou igual à data de início',
      path: ['endDate'],
    },
  )

export type VacationFormValues = z.infer<typeof vacationFormSchema>

const defaultValues: VacationFormValues = {
  employeeId: '',
  startDate: '',
  endDate: '',
  days: '',
  observation: '',
  approverManagerId: '',
  approverRhId: '',
  status: 'PENDENTE',
}

function toDateInput(value?: string | null) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toISOString().slice(0, 10)
}

interface UseVacationFormModalProps {
  open: boolean
  vacation?: Vacation | null
  onSave: (values: VacationFormValues) => Promise<void>
}

export function useVacationFormModal({
  open,
  vacation,
  onSave,
}: UseVacationFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: vacationFormSchema,
      onSubmit: vacationFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    if (vacation) {
      form.reset({
        employeeId: String(vacation.employeeId),
        startDate: toDateInput(vacation.startDate),
        endDate: toDateInput(vacation.endDate),
        days: String(vacation.days),
        observation: vacation.observation ?? '',
        approverManagerId: vacation.approverManagerId
          ? String(vacation.approverManagerId)
          : '',
        approverRhId: vacation.approverRhId
          ? String(vacation.approverRhId)
          : '',
        status: vacation.status,
      })
    } else {
      form.reset(defaultValues)
    }
  }, [open, vacation, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
