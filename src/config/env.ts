import { z } from 'zod'

const envSchema = z.object({
  VITE_GP_API_URL: z.url(),
  VITE_GP_UPLOAD_API_URL: z.url().optional(),
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
