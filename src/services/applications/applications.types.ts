export type ApplicationPersonalDTO = {
  fullName: string
  maritalStatus: number
  gender: number
  birthDate: string
  documentType: number
  documentNumber: string
  documentExpiration: string
  nationality: number
  phone: string
  alternativePhone?: string
  email: string
  address: string
}

export type ApplicationAcademicItemDTO = {
  course: number
  academicLevel: number
  institution: string
  completionYear: string
}

export type ApplicationExperienceItemDTO = {
  institution: string
  course: string
  discipline: string
  startYear: string
  endYear?: string
}

export type UpdateApplicationAcademicEducationItemDTO = {
  id?: number
  course: string
  academicLevel: string
  institution: string
  completionYear: string
}

export type UpdateApplicationAcademicEducationsDTO = {
  items: UpdateApplicationAcademicEducationItemDTO[]
}

export type UpdateApplicationTeachingExperienceItemDTO = {
  id?: number
  institution: string
  course: string
  discipline: string
  startYear: string
  endYear: string
}

export type UpdateApplicationTeachingExperiencesDTO = {
  items: UpdateApplicationTeachingExperienceItemDTO[]
}

export type CreateTeacherApplicationDTO = {
  personal: ApplicationPersonalDTO
  academic: ApplicationAcademicItemDTO[]
  experience: ApplicationExperienceItemDTO[]
  files: {
    identificationDocument: File
    cv: File
    courseCertificate: File
    pedagogicalAggregation: File
    certificates: File[]
  }
}

export type CreateTeacherApplicationResponse = {
  message: string
}

export type ApplicationPerson = {
  id: number
  fullName: string | null
  email: string | null
}

export type ApplicationStatus = {
  id: number
  description: string | null
}

export type ApplicationAcademicDegree = {
  id: number
  designation: string | null
  acronym: string | null
}

export type ApplicationAcademicEducation = {
  id: number
  academicDegreeId: number | null
  trainingArea: string | null
  graduationYear: number | null
  institution: string | null
  candidateId: number | null
  trainingAreaId: number | null
  courseTrainingAreaId: number | null
}

export type ApplicationTeachingExperience = {
  id: number
  title: string | null
  course: string | null
  institution: string | null
  discipline: string | null
  startYear: string | null
  endYear: string | null
  candidateId: number | null
}

export type TeacherApplicationDocument = {
  id: number
  candidateId: number
  documentTypeId: number
  fileName: string
  createdAt: string
  updatedAt: string
}

export type TeacherApplication = {
  id: number
  applicationDate: string | null
  person: ApplicationPerson
  applicationStatus: ApplicationStatus | null
  academicDegree: ApplicationAcademicDegree | null
  academicEducations: ApplicationAcademicEducation[]
  teachingExperiences: ApplicationTeachingExperience[]
  documents: TeacherApplicationDocument[]
}

export type UploadTeacherApplicationDocumentDTO = {
  candidateId: number
  documentTypeId: number
  file: File
}
