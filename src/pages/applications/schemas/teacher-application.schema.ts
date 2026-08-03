import { z } from 'zod'

const fileSchema = z.instanceof(File, {
  message: 'Documento obrigatório',
})

export const personalSchema = z.object({
  fullName: z.string().trim().min(3, 'Nome completo é obrigatório'),
  maritalStatus: z.string().min(1, 'Estado civil é obrigatório'),
  gender: z.string().min(1, 'Género é obrigatório'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  documentType: z.string().min(1, 'Tipo de documento é obrigatório'),
  documentNumber: z
    .string()
    .trim()
    .min(3, 'Número do documento obrigatório')
    .max(30, 'Número do documento muito longo')
    .regex(/^[A-Za-z0-9]+$/, 'O documento deve conter apenas letras e números'),
  documentExpiration: z.string().min(1, 'Data de validade é obrigatória'),
  nationality: z.string().min(1, 'Nacionalidade é obrigatória'),
  phone: z.string().min(9, 'Telefone inválido'),
  alternativePhone: z.string().min(9, 'Telefone inválido').or(z.literal('')),
  email: z.email('E-mail inválido'),
  address: z.string().trim().min(5, 'Endereço é obrigatório'),
})

export const academicItemSchema = z.object({
  course: z.string().min(1, 'Curso é obrigatório'),
  academicLevel: z.string().min(1, 'Nível académico é obrigatório'),
  institution: z.string().trim().min(2, 'Instituição é obrigatória'),
  completionYear: z
    .string()
    .min(4, 'Ano de conclusão é obrigatório')
    .regex(/^\d{4}$/, 'Ano inválido'),
})

export const experienceItemSchema = z.object({
  course: z.string().min(1, 'Curso é obrigatório'),
  institution: z.string().min(1, 'Instituição é obrigatória'),
  discipline: z.string().min(1, 'Disciplina/atividade é obrigatória'),
  startYear: z.string().min(1, 'Ano de início é obrigatório'),
  endYear: z.string().min(1, 'Ano de fim é obrigatório').or(z.literal('')),
})

export const documentsSchema = z.object({
  identificationDocument: fileSchema,
  cv: fileSchema,
  courseCertificate: fileSchema,
  pedagogicalAggregation: fileSchema,
  certificates: z.array(fileSchema).min(1, 'Diplomas são obrigatórios'),
})

export const teacherApplicationSchema = z.object({
  personal: personalSchema,
  academic: z
    .array(academicItemSchema)
    .min(1, 'Adicione pelo menos uma formação académica'),
  experience: z.array(experienceItemSchema),
  documents: documentsSchema,
})

export type TeacherApplicationFormValues = z.infer<
  typeof teacherApplicationSchema
>

export const defaultTeacherApplicationValues: TeacherApplicationFormValues = {
  personal: {
    fullName: '',
    maritalStatus: '',
    gender: '',
    birthDate: '',
    documentType: '',
    documentNumber: '',
    documentExpiration: '',
    nationality: '',
    phone: '',
    alternativePhone: '',
    email: '',
    address: '',
  },
  academic: [
    {
      course: '',
      academicLevel: '',
      institution: '',
      completionYear: '',
    },
  ],
  experience: [
    {
      institution: '',
      course: '',
      discipline: '',
      startYear: '',
      endYear: '',
    },
  ],
  documents: {
    identificationDocument: undefined as unknown as File,
    cv: undefined as unknown as File,
    courseCertificate: undefined as unknown as File,
    pedagogicalAggregation: undefined as unknown as File,
    certificates: [],
  },
}
