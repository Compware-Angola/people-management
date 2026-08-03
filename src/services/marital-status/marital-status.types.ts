export type MaritalStatus = {
  id: number
  description: string
}

export type MaritalStatusResponse = {
  data: MaritalStatus[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type MaritalStatusFilter = {
  search?: string
  page?: number
  limit?: number
}
