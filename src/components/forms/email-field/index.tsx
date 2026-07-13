'use client'

import { useFieldContext } from '..'
import type { Updater } from '@tanstack/react-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface EmailFieldProps {
  label?: string
  placeholder?: string
}

export function EmailField(props: EmailFieldProps) {
  const { label = 'Email', placeholder } = props
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        type="email"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e: { target: { value: Updater<string> } }) =>
          field.handleChange(e.target.value)
        }
        placeholder={placeholder}
        aria-invalid={isInvalid}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
