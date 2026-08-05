'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { Attendance } from '@/services/attendance/attendance.types'

export const attendanceFormSchema = z
  .object({
    employeeId: z.string().min(1, 'Colaborador é obrigatório'),
    startDate: z.string().min(1, 'Data de início é obrigatória'),
    endDate: z.string().optional(),
    hours: z
      .string()
      .optional()
      .refine((value) => !value || Number(value) >= 0, {
        message: 'Horas não pode ser negativo',
      })
      .refine((value) => !value || Number(value) <= 999.99, {
        message: 'Horas deve ser menor ou igual a 999.99',
      }),
    situation: z.enum(['PRESENTE', 'FALTA', 'LICENCA', 'FERIAS', 'ATRASO']),
  })
  .refine(
    (value) => {
      if (!value.endDate) return true

      return new Date(value.endDate) >= new Date(value.startDate)
    },
    {
      message: 'Data de fim deve ser maior ou igual à data de início',
      path: ['endDate'],
    },
  )

export type AttendanceFormValues = z.infer<typeof attendanceFormSchema>

const defaultValues: AttendanceFormValues = {
  employeeId: '',
  startDate: '',
  endDate: '',
  hours: '',
  situation: 'PRESENTE',
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
}

interface UseAttendanceFormModalProps {
  open: boolean
  attendance?: Attendance | null
  onSave: (values: AttendanceFormValues) => Promise<void>
}

export function useAttendanceFormModal({
  open,
  attendance,
  onSave,
}: UseAttendanceFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: attendanceFormSchema,
      onSubmit: attendanceFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    if (attendance) {
      form.reset({
        employeeId: String(attendance.employeeId),
        startDate: toDateTimeLocal(attendance.startDate),
        endDate: toDateTimeLocal(attendance.endDate),
        hours:
          attendance.hours === null || attendance.hours === undefined
            ? ''
            : String(attendance.hours),
        situation: attendance.situation,
      })
    } else {
      form.reset(defaultValues)
    }
  }, [open, attendance, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
