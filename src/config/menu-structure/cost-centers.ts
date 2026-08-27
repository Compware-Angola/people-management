import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { Landmark } from 'lucide-react'

export const COST_CENTERS_NAV: NavItem[] = [
  {
    title: 'Centros de Custo',
    icon: Landmark,
    url: '/cost-centers',
    permission: PermissionsEnum.READ_COST_CENTERS,
  },
]
