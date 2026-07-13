import { createFileRoute } from '@tanstack/react-router'
import { ListEmployees } from '@/pages/employees/list-employees'

export const Route = createFileRoute('/_private/employees/')({
  head: () => ({
    meta: [
      { title: "Colaboradores" },
      { name: "description", content: "Lista de colaboradores" },
    ]
  }),
  component: ListEmployees,
})
