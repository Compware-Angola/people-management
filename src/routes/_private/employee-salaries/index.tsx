import { ListEmployeeSalaries } from '@/pages/employee-salaries/list-employee-salaries'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/employee-salaries/')({
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
