import { useSyncExternalStore } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authStorage } from '@/lib/auth/auth-storage'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { getCurrentUser, login } from '@/services/auth'

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: ['auth', 'current-user'],
    queryFn: () => getCurrentUser(),
    enabled: authStorage.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

export function useCurrentUser() {
  return useQuery(currentUserQueryOptions())
}

export function useAuth() {
  const token = useSyncExternalStore(
    authStorage.subscribe,
    () => authStorage.getToken(),
    () => null,
  )

  return {
    token,
    isAuthenticated: !!token,
  }
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      authStorage.setTokens(data.access_token)
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return function logout() {
    authStorage.clear()
    queryClient.clear()
    navigate({ to: '/login' })
  }
}
