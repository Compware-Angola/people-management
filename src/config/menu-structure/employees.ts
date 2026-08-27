import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { Users } from 'lucide-react'

export const EMPLOYEES_NAV: NavItem[] = [
  {
    title: 'Colaboradores',
    icon: Users,
    url: '/employees',
    permission: PermissionsEnum.READ_EMPLOYEES,
  },
]
