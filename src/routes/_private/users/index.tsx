import { createFileRoute } from '@tanstack/react-router'
import { ListUsers } from '@/pages/employees/list-users'

export const Route = createFileRoute('/_private/users/')({
  head: () => ({
    meta: [
      { title: 'Utilizadores' },
      { name: 'description', content: 'Lista de utilizadores' },
    ],
  }),
  component: ListUsers,
})
