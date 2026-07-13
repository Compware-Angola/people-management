'use client'

import { useFieldContext } from '..'
import { Field, FieldError, FieldLabel } from '../../ui/field'
import { Textarea } from '../../ui/textarea'

interface TextareaFieldProps {
  label?: string
  placeholder?: string
}

export function TextareaField(props: TextareaFieldProps) {
  const { label = 'Texto', placeholder } = props
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={isInvalid}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
