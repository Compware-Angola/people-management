import { ListRequisitions } from '@/pages/requisitions/list-requisitions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/requisitions/')({
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
