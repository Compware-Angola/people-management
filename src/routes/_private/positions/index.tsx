import { ListPositions } from '@/pages/positions/list-positions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/positions/')({
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
