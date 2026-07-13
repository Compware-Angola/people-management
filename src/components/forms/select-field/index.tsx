'use client'

import { useFieldContext } from '..'
import {
    Field,
    FieldError,
    FieldLabel,
} from '@/components/ui/field'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'


type SelectOption = {
    label: string
    value: string
}


interface SelectFieldProps {
    label?: string
    placeholder?: string
    options: SelectOption[]
}


export function SelectField({
    label,
    placeholder = 'Selecionar...',
    options,
}: SelectFieldProps) {

    const field = useFieldContext<string>()

    const isInvalid =
        field.state.meta.isTouched &&
        !field.state.meta.isValid


    return (
        <Field data-invalid={isInvalid}>

            {label && (
                <FieldLabel htmlFor={field.name}>
                    {label}
                </FieldLabel>
            )}


            <Select
                value={field.state.value}
                onValueChange={(value) => {
                    field.handleChange(value)
                }}
            >

                <SelectTrigger
                    id={field.name}
                    aria-invalid={isInvalid}
                    onBlur={field.handleBlur}
                >

                    <SelectValue
                        placeholder={placeholder}
                    />

                </SelectTrigger>


                <SelectContent>

                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </SelectItem>
                    ))}

                </SelectContent>


            </Select>


            {isInvalid && (
                <FieldError
                    errors={field.state.meta.errors}
                />
            )}

        </Field>
    )
}