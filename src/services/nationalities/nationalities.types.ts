export type Nationality = {
  id: number
  description: string
}

export type NationalityResponse = {
  data: Nationality[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type NationalityFilter = {
  search?: string
  page?: number
  limit?: number
}
