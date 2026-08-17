'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { Vacancy } from '@/services/vacancies/vacancies.types'

export const vacancyFormSchema = z
  .object({
    requisitionId: z.string().min(1, 'Requisição é obrigatória'),
    numberOfVacancies: z
      .string()
      .optional()
      .refine((value) => !value || Number(value) >= 1, {
        message: 'Número de vagas deve ser maior ou igual a 1',
      }),
    publicationDate: z.string().optional(),
    closingDate: z.string().optional(),
  })
  .refine(
    (values) => {
      if (!values.publicationDate || !values.closingDate) return true

      return new Date(values.closingDate) > new Date(values.publicationDate)
    },
    {
      message: 'Data de encerramento deve ser posterior à publicação',
      path: ['closingDate'],
    },
  )

export type VacancyFormValues = z.infer<typeof vacancyFormSchema>

const defaultValues: VacancyFormValues = {
  requisitionId: '',
  numberOfVacancies: '',
  publicationDate: '',
  closingDate: '',
}

function formatInputDate(value?: string | null) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toISOString().slice(0, 10)
}

interface UseVacancyFormModalProps {
  open: boolean
  vacancy?: Vacancy | null
  onSave: (values: VacancyFormValues) => Promise<void>
}

export function useVacancyFormModal({
  open,
  vacancy,
  onSave,
}: UseVacancyFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: vacancyFormSchema,
      onSubmit: vacancyFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    if (vacancy) {
      form.reset({
        requisitionId: String(vacancy.requisitionId),
        numberOfVacancies: String(vacancy.numberOfVacancies),
        publicationDate: formatInputDate(vacancy.publicationDate),
        closingDate: formatInputDate(vacancy.closingDate),
      })
    } else {
      form.reset(defaultValues)
    }
  }, [open, vacancy, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
