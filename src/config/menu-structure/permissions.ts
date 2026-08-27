import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { KeyRound } from 'lucide-react'

export const PERMISSIONS_NAV: NavItem[] = [
  {
    title: 'Permissões',
    icon: KeyRound,
    url: '/permissions',
    permission: PermissionsEnum.READ_PERMISSIONS,
  },
]
