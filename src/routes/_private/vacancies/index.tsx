import { ListVacancies } from '@/pages/vacancies/list-vacancies'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/vacancies/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_VACANCIES)
  },
  head: () => ({
    meta: [
      { title: 'Vagas' },
      {
        name: 'description',
        content: 'Consulta e administração de vagas',
      },
    ],
  }),
  component: ListVacancies,
})
