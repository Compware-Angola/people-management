import { z } from 'zod'

const envSchema = z.object({
  VITE_GP_API_URL: z.url(),
})

const parsedEnv = envSchema.safeParse(import.meta.env)

if (!parsedEnv.success) {
  console.error(
    '❌ Variáveis de ambiente inválidas:',
    z.treeifyError(parsedEnv.error),
  )

  throw new Error('Configuração de ambiente inválida')
}

export const env = parsedEnv.data
