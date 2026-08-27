import { ListSalaryProcessing } from '@/pages/salary-processing/list-salary-processing'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/salary-processing/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_SALARY_PROCESSING)
  },
  head: () => ({
    meta: [
      { title: 'Processamentos Salariais' },
      {
        name: 'description',
        content: 'Listagem e validação de processamentos salariais',
      },
    ],
  }),
  component: ListSalaryProcessing,
})
