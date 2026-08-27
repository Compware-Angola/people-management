import { gpApi } from '@/lib/api/gp.api'
import type {
  AssignPermissionsDTO,
  AssignUsersDTO,
  CreateGroupDTO,
  CreatePermissionDTO,
  GroupsListParams,
  MyPermissions,
  Permission,
  PermissionGroup,
  PermissionRelationStatus,
  PermissionUser,
  UpdateGroupDTO,
  UpdatePermissionDTO,
  UpdateRelationStatusDTO,
} from './permissions.types'

async function parseOptionalJson<T>(response: Response): Promise<T | void> {
  if (response.status === 204) {
    return
  }

  const body = await response.text()

  if (!body) {
    return
  }

  return JSON.parse(body) as T
}

function buildGroupsSearchParams(params?: GroupsListParams) {
  const searchParams = new URLSearchParams()

  if (params?.departmentId) {
    searchParams.set('departmentId', String(params.departmentId))
  }

  return searchParams
}

async function findAllGroups(
  params?: GroupsListParams,
): Promise<PermissionGroup[]> {
  return gpApi
    .get('permissions/groups', {
      searchParams: buildGroupsSearchParams(params),
    })
    .json<PermissionGroup[]>()
}

async function createGroup(
  payload: CreateGroupDTO,
): Promise<PermissionGroup | void> {
  const response = await gpApi.post('permissions/groups', { json: payload })

  return parseOptionalJson<PermissionGroup>(response)
}

async function findOneGroup(id: number): Promise<PermissionGroup> {
  return gpApi.get(`permissions/groups/${id}`).json<PermissionGroup>()
}

async function updateGroup(
  id: number,
  payload: UpdateGroupDTO,
): Promise<PermissionGroup | void> {
  const response = await gpApi.patch(`permissions/groups/${id}`, {
    json: payload,
  })

  return parseOptionalJson<PermissionGroup>(response)
}

async function removeGroup(id: number): Promise<void> {
  await gpApi.delete(`permissions/groups/${id}`)
}

async function createPermission(
  payload: CreatePermissionDTO,
): Promise<Permission | void> {
  const response = await gpApi.post('permissions', { json: payload })

  return parseOptionalJson<Permission>(response)
}

async function findAllPermissions(): Promise<Permission[]> {
  return gpApi.get('permissions').json<Permission[]>()
}

async function findOnePermission(id: number): Promise<Permission> {
  return gpApi.get(`permissions/${id}`).json<Permission>()
}

async function updatePermission(
  id: number,
  payload: UpdatePermissionDTO,
): Promise<Permission | void> {
  const response = await gpApi.patch(`permissions/${id}`, { json: payload })

  return parseOptionalJson<Permission>(response)
}

async function removePermission(id: number): Promise<void> {
  await gpApi.delete(`permissions/${id}`)
}

async function assignPermissionsToGroup(
  groupId: number,
  payload: AssignPermissionsDTO,
): Promise<PermissionGroup | void> {
  const response = await gpApi.post(`permissions/groups/${groupId}/permissions`, {
    json: payload,
  })

  return parseOptionalJson<PermissionGroup>(response)
}

async function assignUsersToGroup(
  groupId: number,
  payload: AssignUsersDTO,
): Promise<PermissionGroup | void> {
  const response = await gpApi.post(`permissions/groups/${groupId}/users`, {
    json: payload,
  })

  return parseOptionalJson<PermissionGroup>(response)
}

async function assignDirectPermissionsToUser(
  userId: number,
  payload: AssignPermissionsDTO,
): Promise<PermissionUser | void> {
  const response = await gpApi.post(
    `permissions/users/${userId}/direct-permissions`,
    { json: payload },
  )

  return parseOptionalJson<PermissionUser>(response)
}

async function findUserGroups(userId: number): Promise<PermissionGroup[]> {
  return gpApi
    .get(`permissions/users/${userId}/groups`)
    .json<PermissionGroup[]>()
}

async function findUserDirectPermissions(userId: number): Promise<Permission[]> {
  return gpApi
    .get(`permissions/users/${userId}/direct-permissions`)
    .json<Permission[]>()
}

async function updateGroupPermissionStatus(
  groupId: number,
  permissionId: number,
  payload: UpdateRelationStatusDTO,
): Promise<PermissionRelationStatus | void> {
  const response = await gpApi.patch(
    `permissions/groups/${groupId}/permissions/${permissionId}/status`,
    { json: payload },
  )

  return parseOptionalJson<PermissionRelationStatus>(response)
}

async function updateUserPermissionStatus(
  userId: number,
  permissionId: number,
  payload: UpdateRelationStatusDTO,
): Promise<PermissionRelationStatus | void> {
  const response = await gpApi.patch(
    `permissions/users/${userId}/permissions/${permissionId}/status`,
    { json: payload },
  )

  return parseOptionalJson<PermissionRelationStatus>(response)
}

async function myPermissions():Promise<{permissions:MyPermissions[]}> {
  return gpApi.get<{permissions:MyPermissions[]}>('permissions/me').json()
}

export const permissionsService = {
  findAllGroups,
  createGroup,
  findOneGroup,
  updateGroup,
  removeGroup,
  createPermission,
  findAllPermissions,
  findOnePermission,
  updatePermission,
  removePermission,
  assignPermissionsToGroup,
  assignUsersToGroup,
  assignDirectPermissionsToUser,
  findUserGroups,
  findUserDirectPermissions,
  updateGroupPermissionStatus,
  updateUserPermissionStatus,
  my:myPermissions
}
