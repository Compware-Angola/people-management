import ky from 'ky'
import { env } from '@/config/env'
import { authStorage } from '@/lib/auth/auth-storage'

export const gaApi = ky.create({
  prefix: env.VITE_GA_API_URL,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = authStorage.getToken()
        if (token) request.headers.set('Authorization', `Bearer ${token}`)
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (response.status === 401) {
          authStorage.clear()
          window.location.href = '/login'
        }

        return response
      },
    ],
  },
})
