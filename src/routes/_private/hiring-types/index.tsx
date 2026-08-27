import { ListHiringTypes } from '@/pages/hiring-types/list-hiring-types'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/hiring-types/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_HIRING_TYPES)
  },
  head: () => ({
    meta: [
      { title: 'Tipos de Contratação' },
      {
        name: 'description',
        content: 'Cadastro e listagem de tipos de contratação',
      },
    ],
  }),
  component: ListHiringTypes,
})
