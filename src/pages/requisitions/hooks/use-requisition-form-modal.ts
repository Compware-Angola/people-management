'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { Requisition } from '@/services/requisitions/requisitions.types'

function createRequisitionFormSchema(requireVacancyRequestType: boolean) {
  return z
    .object({
      departmentId: z.string().min(1, 'Departamento é obrigatório'),
      costCenterId: z.string().min(1, 'Centro de custo é obrigatório'),
      positionId: z.string().min(1, 'Cargo é obrigatório'),
      hiringTypeId: z.string().min(1, 'Tipo de contratação é obrigatório'),
      vacancyRequestTypeId: z.string(),
      quantity: z
        .string()
        .min(1, 'Quantidade é obrigatória')
        .refine((value) => Number(value) >= 1, {
          message: 'Quantidade deve ser maior ou igual a 1',
        }),
      justification: z
        .string()
        .min(1, 'Justificativa é obrigatória')
        .max(2000, 'Justificativa deve ter no máximo 2000 caracteres'),
    })
    .superRefine((value, ctx) => {
      if (requireVacancyRequestType && !value.vacancyRequestTypeId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tipo de requisição é obrigatório',
          path: ['vacancyRequestTypeId'],
        })
      }
    })
}

export const requisitionFormSchema = createRequisitionFormSchema(true)

export type RequisitionFormValues = z.infer<typeof requisitionFormSchema>

const defaultValues: RequisitionFormValues = {
  departmentId: '',
  costCenterId: '',
  positionId: '',
  hiringTypeId: '',
  vacancyRequestTypeId: '',
  quantity: '',
  justification: '',
}

interface UseRequisitionFormModalProps {
  open: boolean
  requisition?: Requisition | null
  onSave: (values: RequisitionFormValues) => Promise<void>
}

export function useRequisitionFormModal({
  open,
  requisition,
  onSave,
}: UseRequisitionFormModalProps) {
  const isEdit = Boolean(requisition)
  const schema = createRequisitionFormSchema(!isEdit)

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    if (requisition) {
      form.reset({
        departmentId: String(requisition.department.code),
        costCenterId: String(requisition.costCenter.code),
        positionId: String(requisition.position.code),
        hiringTypeId: String(requisition.hiringType.code),
        vacancyRequestTypeId: requisition.vacancyRequestType
          ? String(requisition.vacancyRequestType.id)
          : '',
        quantity: String(requisition.quantity),
        justification: requisition.justification,
      })
    } else {
      form.reset(defaultValues)
    }
  }, [open, requisition, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
