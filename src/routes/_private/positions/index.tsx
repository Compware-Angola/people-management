import { ListPositions } from '@/pages/positions/list-positions'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/positions/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_POSITIONS)
  },
  head: () => ({
    meta: [
      { title: 'Cargos' },
      {
        name: 'description',
        content: 'Cadastro e listagem de cargos',
      },
    ],
  }),
  component: ListPositions,
})
