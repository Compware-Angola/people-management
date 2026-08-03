'use client'

import { useFieldContext } from '..'
import { Field, FieldError, FieldLabel } from '../../ui/field'
import { Input } from '../../ui/input'

type TextFieldProps = {
  label?: string
  placeholder?: string
} & React.ComponentProps<'input'>

export function TextField(props: TextFieldProps) {
  const { label = 'Texto', placeholder, type = 'text', ...rest } = props
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        {...rest}
        id={field.name}
        type={type}
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
