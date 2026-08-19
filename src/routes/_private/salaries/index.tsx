import { ListSalaries } from '@/pages/salaries/list-salaries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/salaries/')({
  head: () => ({
    meta: [
      { title: 'Estruturas Salariais' },
      {
        name: 'description',
        content: 'Cadastro e listagem de estruturas salariais',
      },
    ],
  }),
  component: ListSalaries,
})
