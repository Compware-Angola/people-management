import { useAppForm } from '@/components/forms'
import { Button } from '@/components/ui/button'
import { useLoginMutation } from '@/hooks/auth'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'

const loginSchema = z.object({
  username: z.string().min(1, 'Introduza o seu nome de usuário'),
  password: z
    .string()
    .min(1, 'Introduza a sua palavra-passe')
    .min(8, 'A palavra-passe deve ter pelo menos 8 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

type LoginFormProps = {
  redirect?: string
}

export function LoginForm({ redirect }: LoginFormProps) {
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()

  const form = useAppForm({
    defaultValues: {
      username: '',
      password: '',
    } as LoginFormValues,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value, {
        onSuccess: () => {
          navigate({ to: redirect ?? '/' })
        },
      })
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-5"
    >
      <form.AppField
        name="username"
        children={(field) => (
          <field.TextField
            label="Nome de usuário"
            placeholder="Introduza o nome de usuário"
            autoComplete="username"
          />
        )}
      />

      <form.AppField
        name="password"
        children={(field) => (
          <field.PasswordField
            label="Palavra-passe"
            placeholder="Introduza a palavra-passe"
          />
        )}
      />

      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
        {loginMutation.isPending && <Loader2 className="animate-spin" />}
        Entrar
      </Button>
    </form>
  )
}
