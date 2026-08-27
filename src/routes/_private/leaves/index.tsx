import { ListLeaves } from '@/pages/leaves/list-leaves'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/leaves/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_LEAVES)
  },
  head: () => ({
    meta: [
      { title: 'Licenças' },
      {
        name: 'description',
        content: 'Registros de licenças de colaboradores',
      },
    ],
  }),
  component: ListLeaves,
})
