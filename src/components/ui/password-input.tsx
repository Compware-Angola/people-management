'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './input-group'

type PasswordInputProps = Omit<
  React.ComponentProps<typeof InputGroupInput>,
  'type'
>

export function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <InputGroup>
      <InputGroupInput type={showPassword ? 'text' : 'password'} {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          variant="ghost"
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          size="icon-xs"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
