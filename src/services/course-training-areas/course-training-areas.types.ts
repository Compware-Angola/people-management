export type CourseTrainingArea = {
  id: number
  description: string
  trainingAreaId: number
  status: number
}

export type CourseTrainingAreaResponse = {
  data: CourseTrainingArea[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type CourseTrainingAreaFilter = {
  page?: number
  limit?: number
  search?: string
  status?: number
}
