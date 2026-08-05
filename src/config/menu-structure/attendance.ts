import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { CalendarCheck } from 'lucide-react'

export const ATTENDANCE_NAV: NavItem[] = [
  {
    title: 'Registros de Assiduidade',
    icon: CalendarCheck,
    url: '/attendance',
  },
]
