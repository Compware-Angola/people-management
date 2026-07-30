export type User = {
  id: number
  name: string
  bi: string
  nif?: string | null
  phone: string
  alternativePhone?: string | null
  province: string
  municipality: string
  address: string
  email: string
  mustChangePassword?: number
  status: number
  createdAt: string
}

export type UserListParams = {
  page?: number
  limit?: number
  bi?: string
  email?: string
  name?: string
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type UserListResponse = {
  data: User[]
  meta: PaginationMeta
}

export type CreateUserDTO = {
  name: string
  bi: string
  nif?: string | null
  phone: string
  alternativePhone?: string | null
  province: string
  municipality: string
  address: string
  email: string
  status?: number
}

export type UpdateUserDTO = Partial<CreateUserDTO> & {
  password?: string
}

export type CreateUserResponse = {
  message: string
}

export type UserResponse = User | CreateUserResponse | { message: string } | void
