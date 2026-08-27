import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { BriefcaseBusiness } from 'lucide-react'

export const POSITIONS_NAV: NavItem[] = [
  {
    title: 'Cargos',
    icon: BriefcaseBusiness,
    url: '/positions',
    permission: PermissionsEnum.READ_POSITIONS,
  },
]
