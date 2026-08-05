export type LoginInput = {
  username: string
  password: string
}

export type AuthUser = {
  codigo: number
  nome: string
  bi?: string
  nif?: string | null
  telefone?: string
  telefone_alternativo?: string | null
  provincia?: string
  municipio?: string
  morada?: string
  email: string
  precisa_mudar_senha?: number
  estado?: number
  criado_em?: string
}

export type LoginResponse = {
  access_token: string
  expires_in: number
  platform: string
  user: AuthUser
  roles: unknown
  permissions: unknown[]
  mensagem: string
}

export type CurrentUserResponse = {
  isAuthenticated: boolean
  user: AuthUser
  message: string
}
