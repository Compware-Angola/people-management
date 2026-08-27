import { ListCostCenters } from '@/pages/cost-centers/list-cost-centers'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/cost-centers/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_COST_CENTERS)
  },
  head: () => ({
    meta: [
      { title: 'Centros de Custo' },
      {
        name: 'description',
        content: 'Cadastro e listagem de centros de custo',
      },
    ],
  }),
  component: ListCostCenters,
})
