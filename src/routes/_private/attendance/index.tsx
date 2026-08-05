import { ListAttendance } from '@/pages/attendance/list-attendance'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/attendance/')({
  head: () => ({
    meta: [
      { title: 'Assiduidade' },
      {
        name: 'description',
        content: 'Registros de assiduidade de colaboradores',
      },
    ],
  }),
  component: ListAttendance,
})
