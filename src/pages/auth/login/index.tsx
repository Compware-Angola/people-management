import { AuthLayout } from '@/pages/auth/components/auth-layout'
import { LoginForm } from '@/pages/auth/components/login-form'

type LoginPageProps = {
  redirect?: string
}

export function LoginPage({ redirect }: LoginPageProps) {
  return (
    <AuthLayout
      title="Entrar na Plataforma"
      description="Acesse a gestão de pessoas com as suas credenciais."
    >
      <LoginForm redirect={redirect} />
    </AuthLayout>
  )
}
