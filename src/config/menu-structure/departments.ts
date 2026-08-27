import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { Building2 } from 'lucide-react'

export const DEPARTMENTS_NAV: NavItem[] = [
  {
    title: 'Departamentos',
    icon: Building2,
    url: '/departments',
    permission: PermissionsEnum.READ_DEPARTMENTS,
  },
]
