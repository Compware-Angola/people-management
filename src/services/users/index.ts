import { gpApi } from '@/lib/api/gp.api'
import type {
  CreateUserDTO,
  CreateUserResponse,
  UpdateUserDTO,
  User,
  UserListParams,
  UserListResponse,
} from './users.types'

async function create(payload: CreateUserDTO): Promise<CreateUserResponse> {
  const response = await gpApi.post('users', { json: payload })

  return response.json<CreateUserResponse>()
}

async function update(id: string, payload: UpdateUserDTO): Promise<User> {
  return gpApi.patch(`users/${id}`, { json: payload }).json<User>()
}

async function findAll(params?: UserListParams): Promise<UserListResponse> {
  return gpApi
    .get('users', {
      searchParams: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        ...(params?.bi ? { bi: params.bi } : {}),
        ...(params?.email ? { email: params.email } : {}),
        ...(params?.name ? { name: params.name } : {}),
      },
    })
    .json<UserListResponse>()
}

async function findOne(id: string): Promise<User> {
  return gpApi.get(`users/${id}`).json<User>()
}

export const usersService = {
  create,
  update,
  findAll,
  findOne,
}
