import  { PermissionsEnum } from '@/enums/permissions.enum'
import type { MyPermissions } from '@/services/permissions/permissions.types'

export function hasFullAccess(
  permissions: MyPermissions[],
): boolean {
  return permissions.some(
    (permission) =>
      permission.slug === PermissionsEnum.FULL_ACCESS,
  )
}

export function hasPermission(
  permissions: MyPermissions[],
  required: PermissionsEnum,
): boolean {
  if (hasFullAccess(permissions)) {
    return true
  }

  return permissions.some(
    (permission) => permission.slug === required,
  )
}

export function hasAnyPermission(
  permissions: MyPermissions[],
  required: PermissionsEnum[],
): boolean {
  return required.some((permission) =>
    hasPermission(permissions, permission),
  )
}

export function hasAllPermissions(
  permissions: MyPermissions[],
  required: PermissionsEnum[],
): boolean {
  return required.every((permission) =>
    hasPermission(permissions, permission),
  )
}

export function normalizePermissions(
  required: PermissionsEnum | PermissionsEnum[],
): PermissionsEnum[] {
  return Array.isArray(required)
    ? required
    : [required]
}
