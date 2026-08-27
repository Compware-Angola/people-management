import { ListPermissionGroups } from '@/pages/permission-groups/list-permission-groups'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/permission-groups/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_PERMISSIONS)
  },
  head: () => ({
    meta: [
      { title: 'Grupos de Permissão' },
      {
        name: 'description',
        content: 'Cadastro e listagem de grupos de permissão',
      },
    ],
  }),
  component: ListPermissionGroups,
})
