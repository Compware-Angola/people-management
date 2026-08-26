import type { PermissionsEnum } from '@/enums/permissions.enum'
import type { QueryClient } from '@tanstack/react-query'
import { redirect } from '@tanstack/react-router'

import { currentUserQueryOptions } from '@/hooks/auth'
import { myPermissionQueryOptions } from '@/hooks/permissions'

import {
  hasAllPermissions,
  hasAnyPermission,
  normalizePermissions,
} from './permissions.util'

import type { MyPermissions } from '@/services/permissions/permissions.types'
import type { CurrentUserResponse } from '@/services/auth/auth.types'

export type AccessRouteGuardResult = {
  user: CurrentUserResponse
  permissions: MyPermissions[]
}

export async function loadAccessGuard(
  queryClient: QueryClient,
  required: PermissionsEnum | PermissionsEnum[],
  mode: 'all' | 'any' = 'all',
): Promise<AccessRouteGuardResult> {
  const [user, permissionResponse] = await Promise.all([
    queryClient
      .ensureQueryData(currentUserQueryOptions())
      .catch(() => null),

    queryClient
      .ensureQueryData(myPermissionQueryOptions)
      .catch(() => null),
  ])

  if (!user || !permissionResponse) {
    throw redirect({
      to: '/',
    })
  }

  const permissions = permissionResponse.permissions
  const requiredPermissions = normalizePermissions(required)

  const authorized =
    mode === 'any'
      ? hasAnyPermission(permissions, requiredPermissions)
      : hasAllPermissions(permissions, requiredPermissions)

  if (!authorized) {
    throw redirect({
      to: '/',
    })
  }

  return {
    user,
    permissions,
  }
}