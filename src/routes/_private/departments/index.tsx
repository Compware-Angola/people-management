import { ListDepartments } from '@/pages/departments/list-departments'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/departments/')({
  head: () => ({
    meta: [
      { title: 'Departamentos' },
      {
        name: 'description',
        content: 'Cadastro e listagem de departamentos',
      },
    ],
  }),
  component: ListDepartments,
})
