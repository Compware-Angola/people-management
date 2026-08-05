import { gpApi } from '@/lib/api/gp.api'
import type {
  Attendance,
  AttendanceListParams,
  AttendanceListResponse,
  CreateAttendanceDTO,
  UpdateAttendanceDTO,
} from './attendance.types'

async function parseOptionalJson<T>(response: Response): Promise<T | void> {
  if (response.status === 204) {
    return
  }

  const body = await response.text()

  if (!body) {
    return
  }

  return JSON.parse(body) as T
}

async function create(payload: CreateAttendanceDTO): Promise<Attendance | void> {
  const response = await gpApi.post('attendance', { json: payload })

  return parseOptionalJson<Attendance>(response)
}

async function findAll(
  params?: AttendanceListParams,
): Promise<AttendanceListResponse> {
  return gpApi
    .get('attendance', {
      searchParams: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
      },
    })
    .json<AttendanceListResponse>()
}

async function findOne(id: string): Promise<Attendance> {
  return gpApi.get(`attendance/${id}`).json<Attendance>()
}

async function findByEmployee(
  employeeId: string,
  params?: AttendanceListParams,
): Promise<AttendanceListResponse> {
  return gpApi
    .get(`attendance/employee/${employeeId}`, {
      searchParams: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
      },
    })
    .json<AttendanceListResponse>()
}

async function update(
  id: string,
  payload: UpdateAttendanceDTO,
): Promise<Attendance | void> {
  const response = await gpApi.patch(`attendance/${id}`, { json: payload })

  return parseOptionalJson<Attendance>(response)
}

async function remove(id: string): Promise<void> {
  await gpApi.delete(`attendance/${id}`)
}

export const attendanceService = {
  create,
  findAll,
  findOne,
  findByEmployee,
  update,
  remove,
}
