import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { EmailField } from './email-field'
import { PasswordField } from './password-field'
import { TextField } from './text-field'
import { TextareaField } from './text-area-field'
import { OTPField } from './otp-field'
import { AsyncComboboxField, ComboboxField } from './async-combobox-field'
import { SelectField } from './select-field'

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    EmailField,
    PasswordField,
    TextField,
    TextareaField,
    OTPField,
    AsyncComboboxField,
    SelectField,
    ComboboxField,
  },
  formComponents: {},
})
