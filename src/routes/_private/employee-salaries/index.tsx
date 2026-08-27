import { ListEmployeeSalaries } from '@/pages/employee-salaries/list-employee-salaries'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/employee-salaries/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_SALARIES)
  },
  head: () => ({
    meta: [
      { title: 'Salários dos Colaboradores' },
      {
        name: 'description',
        content: 'Consulta de salário atual e histórico salarial por colaborador',
      },
    ],
  }),
  component: ListEmployeeSalaries,
})
