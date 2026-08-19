import { ListSalaryProcessing } from '@/pages/salary-processing/list-salary-processing'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/salary-processing/')({
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
