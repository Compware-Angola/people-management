import { ListPermissions } from '@/pages/permissions/list-permissions'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/permissions/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_PERMISSIONS)
  },
  head: () => ({
    meta: [
      { title: 'Permissões' },
      {
        name: 'description',
        content: 'Cadastro e listagem de permissões',
      },
    ],
  }),
  component: ListPermissions,
})
