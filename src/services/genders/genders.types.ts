export type Gender = {
  id: number
  description: string
}

export type GenderResponse = {
  data: Gender[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type GenderFilter = {
  search?: string
  page?: number
  limit?: number
}
