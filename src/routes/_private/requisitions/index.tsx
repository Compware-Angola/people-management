import { ListRequisitions } from '@/pages/requisitions/list-requisitions'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/requisitions/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_REQUISITIONS)
  },
  head: () => ({
    meta: [
      { title: 'Requisições de Vaga' },
      {
        name: 'description',
        content: 'Requisições de vaga e fluxo de aprovação',
      },
    ],
  }),
  component: ListRequisitions,
})
