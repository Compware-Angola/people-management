import { authApi } from '@/lib/api/auth.api'
import type { CurrentUserResponse, LoginInput, LoginResponse } from './auth.types'

const platform = 'PEOPLE_MANAGEMENT'

export async function login(params: LoginInput) {
  return authApi
    .post('/auth/login', {
      json: {
        platform,
        ...params,
      },
    })
    .json<LoginResponse>()
}

export function getCurrentUser(): Promise<CurrentUserResponse> {
  return authApi.get('auth/current-user').json<CurrentUserResponse>()
}
