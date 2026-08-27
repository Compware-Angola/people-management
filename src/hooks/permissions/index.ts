import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { permissionsService } from '@/services/permissions'
import type {
  AssignPermissionsDTO,
  AssignUsersDTO,
  CreateGroupDTO,
  CreatePermissionDTO,
  GroupsListParams,
  UpdateGroupDTO,
  UpdatePermissionDTO,
  UpdateRelationStatusDTO,
} from '@/services/permissions/permissions.types'
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function usePermissionGroupsQuery(params?: GroupsListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.permissions, 'groups', params],
    queryFn: () => permissionsService.findAllGroups(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePermissionGroupDetailsQuery(id?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.permissions, 'groups', 'details', id],
    queryFn: () => permissionsService.findOneGroup(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePermissionsQuery() {
  return useQuery({
    queryKey: [QUERY_KEY.permissions, 'list'],
    queryFn: () => permissionsService.findAllPermissions(),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePermissionDetailsQuery(id?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.permissions, 'details', id],
    queryFn: () => permissionsService.findOnePermission(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export function useUserPermissionGroupsQuery(userId?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.permissions, 'users', userId, 'groups'],
    queryFn: () => permissionsService.findUserGroups(userId!),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  })
}

export function useUserDirectPermissionsQuery(userId?: number) {
  return useQuery({
    queryKey: [QUERY_KEY.permissions, 'users', userId, 'direct-permissions'],
    queryFn: () => permissionsService.findUserDirectPermissions(userId!),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreatePermissionGroupMutation() {
  return useMutation({
    mutationFn: (data: CreateGroupDTO) => permissionsService.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.permissions] })
      toast.success('Grupo registrado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdatePermissionGroupMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGroupDTO }) =>
      permissionsService.updateGroup(id, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.permissions] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.permissions, 'groups', 'details', params.id],
      })
      toast.success('Grupo atualizado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useRemovePermissionGroupMutation() {
  return useMutation({
    mutationFn: (id: number) => permissionsService.removeGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.permissions] })
      toast.success('Grupo removido com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useCreatePermissionMutation() {
  return useMutation({
    mutationFn: (data: CreatePermissionDTO) =>
      permissionsService.createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.permissions] })
      toast.success('Permissão registrada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdatePermissionMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePermissionDTO }) =>
      permissionsService.updatePermission(id, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.permissions] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.permissions, 'details', params.id],
      })
      toast.success('Permissão atualizada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useRemovePermissionMutation() {
  return useMutation({
    mutationFn: (id: number) => permissionsService.removePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.permissions] })
      toast.success('Permissão removida com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useAssignPermissionsToGroupMutation() {
  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: number
      data: AssignPermissionsDTO
    }) => permissionsService.assignPermissionsToGroup(groupId, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.permissions] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.permissions, 'groups', 'details', params.groupId],
      })
      toast.success('Permissões atribuídas ao grupo com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useAssignUsersToGroupMutation() {
  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: number
      data: AssignUsersDTO
    }) => permissionsService.assignUsersToGroup(groupId, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.permissions] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.permissions, 'groups', 'details', params.groupId],
      })
      toast.success('Usuários atribuídos ao grupo com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useAssignDirectPermissionsToUserMutation() {
  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: number
      data: AssignPermissionsDTO
    }) => permissionsService.assignDirectPermissionsToUser(userId, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.permissions] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.permissions, 'users', params.userId, 'groups'],
      })
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEY.permissions,
          'users',
          params.userId,
          'direct-permissions',
        ],
      })
      toast.success('Permissões diretas atribuídas ao usuário com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateGroupPermissionStatusMutation() {
  return useMutation({
    mutationFn: ({
      groupId,
      permissionId,
      data,
    }: {
      groupId: number
      permissionId: number
      data: UpdateRelationStatusDTO
    }) =>
      permissionsService.updateGroupPermissionStatus(
        groupId,
        permissionId,
        data,
      ),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.permissions] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.permissions, 'groups', 'details', params.groupId],
      })
      toast.success('Estado da permissão do grupo atualizado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateUserPermissionStatusMutation() {
  return useMutation({
    mutationFn: ({
      userId,
      permissionId,
      data,
    }: {
      userId: number
      permissionId: number
      data: UpdateRelationStatusDTO
    }) =>
      permissionsService.updateUserPermissionStatus(
        userId,
        permissionId,
        data,
      ),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.permissions] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.permissions, 'users', params.userId, 'groups'],
      })
      toast.success('Estado da permissão do usuário atualizado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}



export const myPermissionQueryOptions = queryOptions({
  queryKey:  [QUERY_KEY.permissions, 'my'],
  queryFn: () => permissionsService.my(),
  staleTime: 5 * 60 * 1000,
})

export function useMyPermissionQuery() {
  return useQuery(myPermissionQueryOptions)
}
