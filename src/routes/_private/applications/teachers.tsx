import { TeacherApplicationPage } from '@/pages/applications/teacher-application-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/applications/teachers')({
  head: () => ({
    meta: [
      { title: 'Candidatura Docente' },
      {
        name: 'description',
        content: 'Cadastro de candidatura docente',
      },
    ],
  }),
  component: TeacherApplicationPage,
})
