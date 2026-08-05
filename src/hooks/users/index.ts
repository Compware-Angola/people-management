import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { usersService } from '@/services/users'
import type {
  CreateUserDTO,
  UpdateUserDTO,
  UserListParams,
} from '@/services/users/users.types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useUsersQuery(params?: UserListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.users, 'list', params],
    queryFn: () => usersService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useUserQuery(id?: string) {
  return useQuery({
    queryKey: [QUERY_KEY.users, 'details', id],
    queryFn: () => usersService.findOne(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateUserMutation() {
  return useMutation({
    mutationFn: (data: CreateUserDTO) => usersService.create(data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.users, 'list'] })
      toast.success(`Utilizador, ${params.name} criado com sucesso`)
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateUserMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDTO }) =>
      usersService.update(id, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.users, 'list'] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.users, 'details', params.id],
      })
      toast.success('Dados do utilizador atualizados com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
