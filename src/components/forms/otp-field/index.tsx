'use client'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { useFieldContext } from '..'
import { Field, FieldError, FieldLabel } from '../../ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

interface OTPFieldProps {
  label?: string
}

export function OTPField(props: OTPFieldProps) {
  const { label = 'Código de verificação' } = props
  const field = useFieldContext<string>()
  const isInvalid =
    field.state.meta.isTouched && !!field.state.meta.errors.length

  return (
    <Field
      data-invalid={isInvalid}
      className="flex flex-col w-fit justify-center items-center gap-4"
    >
      {label && (
        <FieldLabel htmlFor={field.name} className="self-start">
          {label}
        </FieldLabel>
      )}
      <InputOTP
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        id={field.name}
        maxLength={6}
        value={field.state.value}
        onChange={(value) => field.handleChange(value)}
        onBlur={field.handleBlur}
        disabled={field.state.meta.isValidating}
      >
        <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-10 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator className="mx-2" />
        <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-10 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      {isInvalid && (
        <FieldError
          errors={field.state.meta.errors}
          className="text-center w-full"
        />
      )}
    </Field>
  )
}
