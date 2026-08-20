import { ListContracts } from '@/pages/contracts/list-contracts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/contracts/')({
  head: () => ({
    meta: [
      { title: 'Contratos' },
      {
        name: 'description',
        content: 'Cadastro e listagem de contratos',
      },
    ],
  }),
  component: ListContracts,
})
