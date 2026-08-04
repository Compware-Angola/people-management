import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { attendanceService } from '@/services/attendance'
import type {
  AttendanceListParams,
  CreateAttendanceDTO,
  UpdateAttendanceDTO,
} from '@/services/attendance/attendance.types'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useAttendanceQuery(params?: AttendanceListParams) {
  return useQuery({
    queryKey: [QUERY_KEY.attendance, 'list', params],
    queryFn: () => attendanceService.findAll(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useAttendanceDetailsQuery(id?: string) {
  return useQuery({
    queryKey: [QUERY_KEY.attendance, 'details', id],
    queryFn: () => attendanceService.findOne(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export function useEmployeeAttendanceQuery(
  employeeId?: string,
  params?: AttendanceListParams,
) {
  return useQuery({
    queryKey: [QUERY_KEY.attendance, 'employee', employeeId, params],
    queryFn: () => attendanceService.findByEmployee(employeeId!, params),
    enabled: Boolean(employeeId),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })
}

export function useCreateAttendanceMutation() {
  return useMutation({
    mutationFn: (data: CreateAttendanceDTO) => attendanceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.attendance] })
      toast.success('Assiduidade registrada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateAttendanceMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAttendanceDTO }) =>
      attendanceService.update(id, data),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.attendance] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.attendance, 'details', params.id],
      })
      toast.success('Assiduidade atualizada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useRemoveAttendanceMutation() {
  return useMutation({
    mutationFn: (id: string) => attendanceService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.attendance] })
      toast.success('Assiduidade removida com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
