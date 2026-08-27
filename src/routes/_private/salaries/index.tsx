import { ListSalaries } from '@/pages/salaries/list-salaries'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/salaries/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_SALARIES)
  },
  head: () => ({
    meta: [
      { title: 'Estruturas Salariais' },
      {
        name: 'description',
        content: 'Cadastro e listagem de estruturas salariais',
      },
    ],
  }),
  component: ListSalaries,
})
