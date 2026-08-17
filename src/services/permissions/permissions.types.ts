export type PermissionStatus = 0 | 1

export type Permission = {
  id: number
  description: string
  status: PermissionStatus
  createdAt: string
}

export type PermissionDepartment = {
  code: number
  description: string
  status: number
  createdAt?: string
  deletedAt?: string | null
}

export type PermissionUser = {
  id: number
  name: string
  bi?: string
  nif?: string | null
  phone?: string
  alternativePhone?: string | null
  province?: string
  municipality?: string
  address?: string
  email?: string
  mustChangePassword?: number
  status?: number
  createdAt?: string
}

export type PermissionGroup = {
  id: number
  departmentId: number | null
  department?: PermissionDepartment | null
  description: string
  status: PermissionStatus
  createdAt: string
  permissions?: Permission[]
  users?: PermissionUser[]
}

export type PermissionRelationStatus = {
  groupId?: number
  userId?: number
  permissionId: number
  status: PermissionStatus
  createdAt: string
}

export type GroupsListParams = {
  departmentId?: number
}

export type CreatePermissionDTO = {
  description: string
  status?: PermissionStatus
}

export type UpdatePermissionDTO = Partial<CreatePermissionDTO>

export type CreateGroupDTO = {
  description: string
  departmentId?: number
  status?: PermissionStatus
}

export type UpdateGroupDTO = Partial<CreateGroupDTO>

export type AssignPermissionsDTO = {
  permissionIds: number[]
}

export type AssignUsersDTO = {
  userIds: number[]
}

export type UpdateRelationStatusDTO = {
  status: PermissionStatus
}
