'use client'

import { useEffect } from 'react'
import { z } from 'zod'

import { useAppForm } from '@/components/forms'


export const employeeSchema = z.object({

    name: z.string()
        .min(1, 'Nome é obrigatório'),

    bi: z.string()
        .min(1, 'BI é obrigatório'),

    nif: z.string()
        .min(1, 'NIF é obrigatório'),

    phone: z.string()
        .min(1, 'Telefone é obrigatório'),

    alternativePhone: z.string()
        .nullable(),

    province: z.string()
        .min(1, 'Província é obrigatória'),

    municipality: z.string()
        .min(1, 'Município é obrigatório'),

    address: z.string()
        .min(1, 'Morada é obrigatória'),

    email: z.string()
        .email('Email inválido')
        .min(1, 'Email é obrigatório'),

    bank: z.string()
        .min(1, 'Banco é obrigatório'),

    iban: z.string()
        .min(1, 'IBAN é obrigatório'),

    accountHolder: z.string()
        .min(1, 'Titular da conta é obrigatório'),

    currency: z.string(),

    status: z.number(),

})


export type EmployeeFormValues =
    z.infer<typeof employeeSchema>



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

    employee?: EmployeeFormValues | null

    onSave: (
        values: EmployeeFormValues
    ) => Promise<void>

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

        }

    })


    useEffect(() => {

        if (employee) {

            form.reset(employee)

        } else {

            form.reset(defaultValues)

        }

    }, [employee])


    return {

        form,

        canSubmit:
            form.state.canSubmit,

        isLoading:
            form.state.isSubmitting

    }

}