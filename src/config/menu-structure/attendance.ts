import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { CalendarCheck } from 'lucide-react'

export const ATTENDANCE_NAV: NavItem[] = [
  {
    title: 'Registros de Assiduidade',
    icon: CalendarCheck,
    url: '/attendance',
    permission: PermissionsEnum.READ_ATTENDANCE,
  },
]
