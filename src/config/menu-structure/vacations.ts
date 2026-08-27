import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { CalendarDays } from 'lucide-react'

export const VACATIONS_NAV: NavItem[] = [
  {
    title: 'Registros de Férias',
    icon: CalendarDays,
    url: '/vacations',
    permission: PermissionsEnum.READ_VACATIONS,
  },
]
