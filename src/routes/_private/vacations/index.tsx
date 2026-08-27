import { ListVacations } from '@/pages/vacations/list-vacations'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/vacations/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_VACATIONS)
  },
  head: () => ({
    meta: [
      { title: 'Férias' },
      {
        name: 'description',
        content: 'Registros de férias de colaboradores',
      },
    ],
  }),
  component: ListVacations,
})
