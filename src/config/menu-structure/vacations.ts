import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { CalendarDays } from 'lucide-react'

export const VACATIONS_NAV: NavItem[] = [
  {
    title: 'Registros de Férias',
    icon: CalendarDays,
    url: '/vacations',
  },
]
