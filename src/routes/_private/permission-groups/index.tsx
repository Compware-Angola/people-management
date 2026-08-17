import { ListPermissionGroups } from '@/pages/permission-groups/list-permission-groups'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/permission-groups/')({
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
