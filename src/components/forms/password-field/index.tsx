'use client'
import { Field, FieldError, FieldLabel } from '../../ui/field'
import { useFieldContext } from '..'

import type { Updater } from '@tanstack/react-form'
import { PasswordInput } from '@/components/ui/password-input'

interface PasswordFieldProps {
  label?: string
  placeholder?: string
}

export function PasswordField(props: PasswordFieldProps) {
  const { label = 'Password', placeholder } = props
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <PasswordInput
        autoComplete="current-password"
        id={field.name}
        onBlur={field.handleBlur}
        value={field.state.value}
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
