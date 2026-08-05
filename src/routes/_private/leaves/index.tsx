import { ListLeaves } from '@/pages/leaves/list-leaves'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/leaves/')({
  head: () => ({
    meta: [
      { title: 'Licenças' },
      {
        name: 'description',
        content: 'Registros de licenças de colaboradores',
      },
    ],
  }),
  component: ListLeaves,
})
