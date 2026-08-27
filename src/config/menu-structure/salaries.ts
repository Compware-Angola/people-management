import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { BadgeDollarSign, Calculator, Users } from 'lucide-react'

export const SALARIES_NAV: NavItem[] = [
  {
    title: 'Estruturas Salariais',
    icon: BadgeDollarSign,
    url: '/salaries',
    permission: PermissionsEnum.READ_SALARIES,
  },
  {
    title: 'Salários dos Colaboradores',
    icon: Users,
    url: '/employee-salaries',
    permission: PermissionsEnum.READ_SALARIES,
  },
  {
    title: 'Processamentos Salariais',
    icon: Calculator,
    url: '/salary-processing',
    permission: PermissionsEnum.READ_SALARY_PROCESSING,
  },
]
