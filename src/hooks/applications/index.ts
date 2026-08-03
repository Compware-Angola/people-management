import { QUERY_KEY } from '@/constants/query-key'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import { queryClient } from '@/lib/query-client'
import { applicationsService } from '@/services/applications'
import type {
  CreateTeacherApplicationDTO,
  UpdateApplicationAcademicEducationsDTO,
  UpdateApplicationTeachingExperiencesDTO,
  UploadTeacherApplicationDocumentDTO,
} from '@/services/applications/applications.types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useMyTeacherApplicationQuery() {
  return useQuery({
    queryKey: [QUERY_KEY.applications, 'me'],
    queryFn: () => applicationsService.getMyTeacherApplication(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateTeacherApplicationMutation() {
  return useMutation({
    mutationFn: (data: CreateTeacherApplicationDTO) =>
      applicationsService.createTeacherApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.applications],
      })
      toast.success('Candidatura criada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateApplicationAcademicEducationsMutation() {
  return useMutation({
    mutationFn: ({
      candidateId,
      data,
    }: {
      candidateId: number
      data: UpdateApplicationAcademicEducationsDTO
    }) => applicationsService.updateAcademicEducations(candidateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.applications, 'me'],
      })
      toast.success('Formação académica atualizada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUpdateApplicationTeachingExperiencesMutation() {
  return useMutation({
    mutationFn: ({
      candidateId,
      data,
    }: {
      candidateId: number
      data: UpdateApplicationTeachingExperiencesDTO
    }) => applicationsService.updateTeachingExperiences(candidateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.applications, 'me'],
      })
      toast.success('Experiência docente atualizada com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}

export function useUploadTeacherApplicationDocumentMutation() {
  return useMutation({
    mutationFn: (data: UploadTeacherApplicationDocumentDTO) =>
      applicationsService.uploadDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.applications, 'me'],
      })
      toast.success('Documento atualizado com sucesso')
    },
    onError: async (error) => {
      toast.error(await getApiErrorMessage(error))
    },
  })
}
