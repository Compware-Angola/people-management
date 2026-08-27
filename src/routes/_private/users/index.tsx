import { createFileRoute } from '@tanstack/react-router'
import { ListUsers } from '@/pages/employees/list-users'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { PermissionsEnum } from '@/enums/permissions.enum'

export const Route = createFileRoute('/_private/users/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_USERS)
  },
  head: () => ({
    meta: [
      { title: 'Utilizadores' },
      { name: 'description', content: 'Lista de utilizadores' },
    ],
  }),
  component: ListUsers,
})
