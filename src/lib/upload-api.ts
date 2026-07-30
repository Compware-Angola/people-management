import ky from 'ky'
import { env } from '@/config/env'

export const uploadApi = ky.create({
  retry: 0,
  prefix: env.VITE_GP_UPLOAD_API_URL ?? env.VITE_GP_API_URL,
})
