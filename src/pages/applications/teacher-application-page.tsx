import { useMemo, useState } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { useAppForm } from '@/components/forms'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAcademicDegreesQuery } from '@/hooks/academic-degrees'
import { useCreateTeacherApplicationMutation } from '@/hooks/applications'
import { useCourseTrainingAreasQuery } from '@/hooks/course-training-areas'
import { useDocumentTypesQuery } from '@/hooks/document-types'
import { useGendersQuery } from '@/hooks/genders'
import { useMaritalStatusQuery } from '@/hooks/marital-status'
import { useNationalitiesQuery } from '@/hooks/nationalities'
import type { CreateTeacherApplicationDTO } from '@/services/applications/applications.types'
import {
  defaultTeacherApplicationValues,
  teacherApplicationSchema,
  type TeacherApplicationFormValues,
} from './schemas/teacher-application.schema'

const EMPTY_ACADEMIC_ITEM: TeacherApplicationFormValues['academic'][number] = {
  course: '',
  academicLevel: '',
  institution: '',
  completionYear: '',
}

const EMPTY_EXPERIENCE_ITEM: TeacherApplicationFormValues['experience'][number] =
  {
    institution: '',
    course: '',
    discipline: '',
    startYear: '',
    endYear: '',
  }

function toNumber(value: string) {
  return Number(value)
}

function fileListToArray(files: FileList | null) {
  return files ? Array.from(files) : []
}

function FileField({
  label,
  multiple,
  accept,
  onChange,
}: {
  label: string
  multiple?: boolean
  accept?: string
  onChange: (files: FileList | null) => void
}) {
  return (
    <>
      <FieldLabel>{label}</FieldLabel>
      <Input
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={(event) => onChange(event.target.files)}
      />
    </>
  )
}

function SectionTitle({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="space-y-1">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export function TeacherApplicationPage() {
  const [resetKey, setResetKey] = useState(0)
  const createApplication = useCreateTeacherApplicationMutation()

  const documentTypesQuery = useDocumentTypesQuery({
    page: 1,
    limit: 100,
    ids: [1, 2],
  })
  const gendersQuery = useGendersQuery({ page: 1, limit: 100 })
  const maritalStatusQuery = useMaritalStatusQuery({ page: 1, limit: 100 })
  const nationalitiesQuery = useNationalitiesQuery({ page: 1, limit: 300 })
  const academicDegreesQuery = useAcademicDegreesQuery({
    page: 1,
    limit: 100,
    status: 1,
    ids: [2, 3],
  })
  const coursesQuery = useCourseTrainingAreasQuery({
    page: 1,
    limit: 300,
    status: 1,
  })

  const documentTypeOptions = useMemo(
    () =>
      (documentTypesQuery.data ?? []).map((item) => ({
        label: item.description,
        value: String(item.id),
      })),
    [documentTypesQuery.data],
  )
  const genderOptions = useMemo(
    () =>
      (gendersQuery.data ?? []).map((item) => ({
        label: item.description,
        value: String(item.id),
      })),
    [gendersQuery.data],
  )
  const maritalStatusOptions = useMemo(
    () =>
      (maritalStatusQuery.data ?? []).map((item) => ({
        label: item.description,
        value: String(item.id),
      })),
    [maritalStatusQuery.data],
  )
  const nationalityOptions = useMemo(
    () =>
      (nationalitiesQuery.data ?? []).map((item) => ({
        label: item.description,
        value: String(item.id),
      })),
    [nationalitiesQuery.data],
  )
  const academicDegreeOptions = useMemo(
    () =>
      (academicDegreesQuery.data ?? []).map((item) => ({
        label: item.description,
        value: String(item.id),
      })),
    [academicDegreesQuery.data],
  )
  const courseOptions = useMemo(
    () =>
      (coursesQuery.data ?? []).map((item) => ({
        label: item.description,
        value: String(item.id),
      })),
    [coursesQuery.data],
  )

  const form = useAppForm({
    defaultValues: defaultTeacherApplicationValues,
    validators: {
      onChange: teacherApplicationSchema,
      onSubmit: teacherApplicationSchema,
    },
    onSubmit: async ({ value }) => {
      const payload: CreateTeacherApplicationDTO = {
        personal: {
          fullName: value.personal.fullName,
          maritalStatus: toNumber(value.personal.maritalStatus),
          gender: toNumber(value.personal.gender),
          birthDate: value.personal.birthDate,
          documentType: toNumber(value.personal.documentType),
          documentNumber: value.personal.documentNumber,
          documentExpiration: value.personal.documentExpiration,
          nationality: toNumber(value.personal.nationality),
          phone: value.personal.phone,
          alternativePhone: value.personal.alternativePhone,
          email: value.personal.email,
          address: value.personal.address,
        },
        academic: value.academic.map((item) => ({
          course: toNumber(item.course),
          academicLevel: toNumber(item.academicLevel),
          institution: item.institution,
          completionYear: item.completionYear,
        })),
        experience: value.experience.map((item) => ({
          institution: item.institution,
          course: item.course,
          discipline: item.discipline,
          startYear: item.startYear,
          endYear: item.endYear || undefined,
        })),
        files: {
          identificationDocument: value.documents.identificationDocument,
          cv: value.documents.cv,
          courseCertificate: value.documents.courseCertificate,
          pedagogicalAggregation: value.documents.pedagogicalAggregation,
          certificates: value.documents.certificates,
        },
      }

      await createApplication.mutateAsync(payload)
      form.reset(defaultTeacherApplicationValues)
      setResetKey((current) => current + 1)
    },
  })

  function resetForm() {
    form.reset(defaultTeacherApplicationValues)
    setResetKey((current) => current + 1)
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Candidatura Docente</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold tracking-tight">
          Candidatura Docente
        </h1>
        <p className="text-muted-foreground">
          Registe candidaturas docentes com dados pessoais, formação,
          experiência e documentos.
        </p>
      </div>

      <form
        className="space-y-6"
        key={resetKey}
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
        <Card className="space-y-6 p-6">
          <SectionTitle
            title="Dados pessoais"
            description="Identificação e contactos principais do candidato."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <form.AppField name="personal.fullName">
              {(field) => <field.TextField label="Nome completo" />}
            </form.AppField>
            <form.AppField name="personal.email">
              {(field) => <field.TextField label="Email" type="email" />}
            </form.AppField>
            <form.AppField name="personal.gender">
              {(field) => (
                <field.ComboboxField
                  label="Género"
                  placeholder="Selecione o género"
                  options={genderOptions}
                />
              )}
            </form.AppField>
            <form.AppField name="personal.maritalStatus">
              {(field) => (
                <field.ComboboxField
                  label="Estado civil"
                  placeholder="Selecione o estado civil"
                  options={maritalStatusOptions}
                />
              )}
            </form.AppField>
            <form.AppField name="personal.birthDate">
              {(field) => (
                <field.TextField label="Data de nascimento" type="date" />
              )}
            </form.AppField>
            <form.AppField name="personal.nationality">
              {(field) => (
                <field.ComboboxField
                  label="Nacionalidade"
                  placeholder="Selecione a nacionalidade"
                  options={nationalityOptions}
                />
              )}
            </form.AppField>
            <form.AppField name="personal.documentType">
              {(field) => (
                <field.ComboboxField
                  label="Tipo de documento"
                  placeholder="Selecione o tipo de documento"
                  options={documentTypeOptions}
                />
              )}
            </form.AppField>
            <form.AppField name="personal.documentNumber">
              {(field) => <field.TextField label="Número do documento" />}
            </form.AppField>
            <form.AppField name="personal.documentExpiration">
              {(field) => (
                <field.TextField
                  label="Data de expiração do documento"
                  type="date"
                />
              )}
            </form.AppField>
            <form.AppField name="personal.phone">
              {(field) => <field.TextField label="Telefone" />}
            </form.AppField>
            <form.AppField name="personal.alternativePhone">
              {(field) => <field.TextField label="Telefone alternativo" />}
            </form.AppField>
            <div className="md:col-span-2">
              <form.AppField name="personal.address">
                {(field) => <field.TextareaField label="Morada" />}
              </form.AppField>
            </div>
          </div>
        </Card>

        <Card className="space-y-6 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <SectionTitle
              title="Formação académica"
              description="Adicione pelo menos uma formação concluída."
            />
            <form.Field name="academic" mode="array">
              {(academicField) => (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => academicField.pushValue(EMPTY_ACADEMIC_ITEM)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar formação
                </Button>
              )}
            </form.Field>
          </div>

          <form.Field name="academic" mode="array">
            {(academicField) => (
              <div className="space-y-4">
                {academicField.state.value.map((_, index) => (
                  <div className="rounded-lg border p-4" key={index}>
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <h3 className="font-medium">Formação {index + 1}</h3>
                      {academicField.state.value.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => academicField.removeValue(index)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remover
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <form.AppField name={`academic[${index}].course`}>
                        {(field) => (
                          <field.ComboboxField
                            label="Curso / área de formação"
                            placeholder="Selecione o curso"
                            options={courseOptions}
                          />
                        )}
                      </form.AppField>
                      <form.AppField name={`academic[${index}].academicLevel`}>
                        {(field) => (
                          <field.ComboboxField
                            label="Grau académico"
                            placeholder="Selecione o grau"
                            options={academicDegreeOptions}
                          />
                        )}
                      </form.AppField>
                      <form.AppField name={`academic[${index}].institution`}>
                        {(field) => <field.TextField label="Instituição" />}
                      </form.AppField>
                      <form.AppField name={`academic[${index}].completionYear`}>
                        {(field) => (
                          <field.TextField
                            label="Ano de conclusão"
                            placeholder="2024"
                          />
                        )}
                      </form.AppField>
                    </div>
                  </div>
                ))}
                {academicField.state.meta.isTouched &&
                  !academicField.state.meta.isValid && (
                    <FieldError errors={academicField.state.meta.errors} />
                  )}
              </div>
            )}
          </form.Field>
        </Card>

        <Card className="space-y-6 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <SectionTitle
              title="Experiência docente"
              description="Informe a experiência de ensino do candidato."
            />
            <form.Field name="experience" mode="array">
              {(experienceField) => (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    experienceField.pushValue(EMPTY_EXPERIENCE_ITEM)
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar experiência
                </Button>
              )}
            </form.Field>
          </div>

          <form.Field name="experience" mode="array">
            {(experienceField) => (
              <div className="space-y-4">
                {experienceField.state.value.map((_, index) => (
                  <div className="rounded-lg border p-4" key={index}>
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <h3 className="font-medium">Experiência {index + 1}</h3>
                      {experienceField.state.value.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => experienceField.removeValue(index)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remover
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <form.AppField name={`experience[${index}].institution`}>
                        {(field) => <field.TextField label="Instituição" />}
                      </form.AppField>
                      <form.AppField name={`experience[${index}].course`}>
                        {(field) => <field.TextField label="Curso" />}
                      </form.AppField>
                      <form.AppField name={`experience[${index}].discipline`}>
                        {(field) => (
                          <field.TextField label="Disciplina / atividade" />
                        )}
                      </form.AppField>
                      <form.AppField name={`experience[${index}].startYear`}>
                        {(field) => (
                          <field.TextField label="Data de início" type="date" />
                        )}
                      </form.AppField>
                      <form.AppField name={`experience[${index}].endYear`}>
                        {(field) => (
                          <field.TextField label="Data de fim" type="date" />
                        )}
                      </form.AppField>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form.Field>
        </Card>

        <Card className="space-y-6 p-6">
          <SectionTitle
            title="Documentos"
            description="Anexe os documentos exigidos para concluir a candidatura."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <form.Field name="documents.identificationDocument">
              {(field) => (
                <Field data-invalid={!field.state.meta.isValid}>
                  <FileField
                    label="Documento de identificação"
                    accept=".pdf,.jpg,.png"
                    onChange={(files) =>
                      field.handleChange(files?.[0] ?? (undefined as unknown as File))
                    }
                  />
                  {!field.state.meta.isValid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            </form.Field>
            <form.Field name="documents.cv">
              {(field) => (
                <Field data-invalid={!field.state.meta.isValid}>
                  <FileField
                    label="Curriculum Vitae"
                    accept=".pdf,.doc,.docx"
                    onChange={(files) =>
                      field.handleChange(files?.[0] ?? (undefined as unknown as File))
                    }
                  />
                  {!field.state.meta.isValid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            </form.Field>
            <form.Field name="documents.courseCertificate">
              {(field) => (
                <Field data-invalid={!field.state.meta.isValid}>
                  <FileField
                    label="Certificado do curso"
                    accept=".pdf,.jpg,.png"
                    onChange={(files) =>
                      field.handleChange(files?.[0] ?? (undefined as unknown as File))
                    }
                  />
                  {!field.state.meta.isValid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            </form.Field>
            <form.Field name="documents.pedagogicalAggregation">
              {(field) => (
                <Field data-invalid={!field.state.meta.isValid}>
                  <FileField
                    label="Agregação / formação pedagógica"
                    accept=".pdf,.jpg,.png"
                    onChange={(files) =>
                      field.handleChange(files?.[0] ?? (undefined as unknown as File))
                    }
                  />
                  {!field.state.meta.isValid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            </form.Field>
            <form.Field name="documents.certificates">
              {(field) => (
                <Field className="md:col-span-2" data-invalid={!field.state.meta.isValid}>
                  <FileField
                    label="Diplomas"
                    accept=".pdf,.jpg,.png"
                    multiple
                    onChange={(files) => field.handleChange(fileListToArray(files))}
                  />
                  {!field.state.meta.isValid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              )}
            </form.Field>
          </div>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={resetForm}>
            Limpar
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting || createApplication.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting || createApplication.isPending
                  ? 'A submeter candidatura...'
                  : 'Submeter candidatura'}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  )
}
