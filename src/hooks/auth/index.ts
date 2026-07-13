// import { useMeQuery } from '@/pages/profile/hooks/queries'

import type { PermissionsEnum } from '@/enums/permissions.enum'
// import { logoutFn } from '@/server-fn/auth.serverFn'
// import type { ApiError } from '@/types'
// import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
// import { useServerFn } from '@tanstack/react-start'
// import type { HTTPError } from 'ky'
// import { toast } from 'sonner'
// import { hasAnyPermission, hasPermission } from '@/utils/permissions.util'
import { AdminAccessLevelEnum } from '@/enums/admin.enum'

export const useAuth = () => {
  // const { data: user } = useMeQuery()
  // const queryClient = useQueryClient()
  // const navigate = useNavigate()
  // const serverFn = useServerFn(logoutFn)
  // const logout = useMutation<void, HTTPError<ApiError>, void>({
  //   mutationFn: () => serverFn({}),
  //   onSuccess: () => {
  //     queryClient.clear()
  //     navigate({ to: '/auth/login' })
  //   },
  //   onError: (error) => {
  //     const errorMessage = error.message
  //     toast.error(errorMessage)
  //   },
  // })

  return {
    can: (perm: PermissionsEnum | PermissionsEnum[]) => true,
    canAny: (perm: PermissionsEnum[]) => true,
    isAuthenticated: true,
    hasFullAccess: true,
  }
}
