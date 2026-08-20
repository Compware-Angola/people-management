'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'
import type { Contract } from '@/services/contracts/contracts.types'

export const contractFormSchema = z.object({
  type: z.enum(['CONTRATADO', 'HORISTA', 'FIXO']),
  status: z.enum(['ATIVO', 'INATIVO']),
  allowsOvertime: z.enum(['0', '1']),
  monthlyHours: z
    .string()
    .min(1, 'Horas mensais é obrigatório')
    .refine((value) => Number(value) > 0, {
      message: 'Horas mensais deve ser maior que zero',
    }),
})

export type ContractFormValues = z.infer<typeof contractFormSchema>

const defaultValues: ContractFormValues = {
  type: 'CONTRATADO',
  status: 'ATIVO',
  allowsOvertime: '0',
  monthlyHours: '',
}

interface UseContractFormModalProps {
  open: boolean
  contract?: Contract | null
  onSave: (values: ContractFormValues) => Promise<void>
}

export function useContractFormModal({
  open,
  contract,
  onSave,
}: UseContractFormModalProps) {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: contractFormSchema,
      onSubmit: contractFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSave(value)
    },
  })

  useEffect(() => {
    if (!open) return

    if (contract) {
      form.reset({
        type: contract.type,
        status: contract.status,
        allowsOvertime: String(
          contract.allowsOvertime,
        ) as ContractFormValues['allowsOvertime'],
        monthlyHours: String(contract.monthlyHours),
      })
    } else {
      form.reset(defaultValues)
    }
  }, [open, contract, form])

  return {
    form,
    canSubmit: form.state.canSubmit,
    isLoading: form.state.isSubmitting,
  }
}
