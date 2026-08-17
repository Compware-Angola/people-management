import { ListVacancies } from '@/pages/vacancies/list-vacancies'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/vacancies/')({
  head: () => ({
    meta: [
      { title: 'Vagas' },
      {
        name: 'description',
        content: 'Consulta e administração de vagas',
      },
    ],
  }),
  component: ListVacancies,
})
