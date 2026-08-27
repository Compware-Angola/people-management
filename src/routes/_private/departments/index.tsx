import { ListDepartments } from '@/pages/departments/list-departments'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/departments/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_DEPARTMENTS)
  },
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
