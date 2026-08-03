export type AcademicDegree = {
  id: number
  description: string
}

export type AcademicDegreeResponse = {
  data: AcademicDegree[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type AcademicDegreeFilter = {
  search?: string
  page?: number
  limit?: number
  status?: number
  ids?: number[]
}
