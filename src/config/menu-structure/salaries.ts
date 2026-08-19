import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { BadgeDollarSign, Calculator, Users } from 'lucide-react'

export const SALARIES_NAV: NavItem[] = [
  {
    title: 'Estruturas Salariais',
    icon: BadgeDollarSign,
    url: '/salaries',
  },
  {
    title: 'Salários dos Colaboradores',
    icon: Users,
    url: '/employee-salaries',
  },
  {
    title: 'Processamentos Salariais',
    icon: Calculator,
    url: '/salary-processing',
  },
]
