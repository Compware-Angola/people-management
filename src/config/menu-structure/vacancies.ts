import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { ClipboardList } from 'lucide-react'

export const VACANCIES_NAV: NavItem[] = [
  {
    title: 'Vagas',
    icon: ClipboardList,
    url: '/vacancies',
  },
]
