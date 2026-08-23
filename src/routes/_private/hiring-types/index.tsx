import { ListHiringTypes } from '@/pages/hiring-types/list-hiring-types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/hiring-types/')({
  head: () => ({
    meta: [
      { title: 'Tipos de Contratação' },
      {
        name: 'description',
        content: 'Cadastro e listagem de tipos de contratação',
      },
    ],
  }),
  component: ListHiringTypes,
})
