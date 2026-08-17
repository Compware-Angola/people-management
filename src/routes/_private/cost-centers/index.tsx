import { ListCostCenters } from '@/pages/cost-centers/list-cost-centers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/cost-centers/')({
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
