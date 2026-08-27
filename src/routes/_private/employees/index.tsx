import { createFileRoute } from '@tanstack/react-router'
import { ListEmployees } from '@/pages/employees/list-employees'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { PermissionsEnum } from '@/enums/permissions.enum'

export const Route = createFileRoute('/_private/employees/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_EMPLOYEES)
  },
  head: () => ({
    meta: [
      { title: 'Colaboradores' },
      { name: 'description', content: 'Lista de colaboradores' },
    ],
  }),
  component: ListEmployees,
})
