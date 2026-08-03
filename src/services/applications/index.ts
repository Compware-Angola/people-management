import { gpApi } from '@/lib/api/gp.api'
import type {
  TeacherApplication,
  CreateTeacherApplicationDTO,
  CreateTeacherApplicationResponse,
  UpdateApplicationAcademicEducationsDTO,
  UpdateApplicationTeachingExperiencesDTO,
  UploadTeacherApplicationDocumentDTO,
} from './applications.types'

function buildTeacherApplicationFormData(payload: CreateTeacherApplicationDTO) {
  const formData = new FormData()

  formData.append('personal', JSON.stringify(payload.personal))
  formData.append('academic', JSON.stringify(payload.academic))
  formData.append('experience', JSON.stringify(payload.experience))
  formData.append('identificationDocument', payload.files.identificationDocument)
  formData.append('cv', payload.files.cv)
  formData.append('courseCertificate', payload.files.courseCertificate)
  formData.append('pedagogicalAggregation', payload.files.pedagogicalAggregation)

  payload.files.certificates.forEach((certificate) => {
    formData.append('certificates', certificate)
  })

  return formData
}

async function createTeacherApplication(
  payload: CreateTeacherApplicationDTO,
): Promise<CreateTeacherApplicationResponse> {
  return gpApi
    .post('applications/teachers', {
      body: buildTeacherApplicationFormData(payload),
    })
    .json<CreateTeacherApplicationResponse>()
}

async function getMyTeacherApplication(): Promise<TeacherApplication | null> {
  return gpApi.get('applications/me').json<TeacherApplication | null>()
}

async function updateAcademicEducations(
  candidateId: number,
  payload: UpdateApplicationAcademicEducationsDTO,
): Promise<TeacherApplication | null> {
  return gpApi
    .put(`applications/${candidateId}/academic-educations`, { json: payload })
    .json<TeacherApplication | null>()
}

async function updateTeachingExperiences(
  candidateId: number,
  payload: UpdateApplicationTeachingExperiencesDTO,
): Promise<TeacherApplication | null> {
  return gpApi
    .put(`applications/${candidateId}/teaching-experiences`, { json: payload })
    .json<TeacherApplication | null>()
}

function buildDocumentFormData(payload: UploadTeacherApplicationDocumentDTO) {
  const formData = new FormData()

  formData.append('documentTypeId', String(payload.documentTypeId))
  formData.append('file', payload.file)

  return formData
}

async function uploadDocument(
  payload: UploadTeacherApplicationDocumentDTO,
): Promise<TeacherApplication | null> {
  return gpApi
    .post(`applications/${payload.candidateId}/documents`, {
      body: buildDocumentFormData(payload),
    })
    .json<TeacherApplication | null>()
}

export const applicationsService = {
  createTeacherApplication,
  getMyTeacherApplication,
  updateAcademicEducations,
  updateTeachingExperiences,
  uploadDocument,
}
