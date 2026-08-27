import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { ShieldCheck } from 'lucide-react'

export const PERMISSION_GROUPS_NAV: NavItem[] = [
  {
    title: 'Grupos de Permissão',
    icon: ShieldCheck,
    url: '/permission-groups',
    permission: PermissionsEnum.READ_PERMISSIONS,
  },
]
