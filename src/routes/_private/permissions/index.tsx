import { ListPermissions } from '@/pages/permissions/list-permissions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/permissions/')({
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
