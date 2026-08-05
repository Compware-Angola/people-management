import ky from 'ky'
import { env } from '@/config/env'
import { authStorage } from '@/lib/auth/auth-storage'

export const authApi = ky.create({
  prefix: env.VITE_NEST_AUTH_API_URL,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = authStorage.getToken()
        if (token) request.headers.set('Authorization', `Bearer ${token}`)
      },
    ],
    afterResponse: [
      ({ response }) => {
        if (response.status === 401) {
          authStorage.clear()
          window.location.href = '/login'
        }

        return response
      },
    ],
  },
})
