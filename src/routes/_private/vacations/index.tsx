import { ListVacations } from '@/pages/vacations/list-vacations'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/vacations/')({
  head: () => ({
    meta: [
      { title: 'Férias' },
      {
        name: 'description',
        content: 'Registros de férias de colaboradores',
      },
    ],
  }),
  component: ListVacations,
})
