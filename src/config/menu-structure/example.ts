import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import {
  Activity,
  Briefcase,
  Eye,
  KeyRound,
  Shield,
  UserCog,
} from 'lucide-react'

export const EXAMPLE_NAV: NavItem[] = [
  {
    title: 'Exemplo 1',
    icon: UserCog,
    url: '/admins',
    permission: [PermissionsEnum.READ_ADMIN],
  },
  {
    title: 'About',
    icon: Briefcase,
    url: '/about',
    permission: [
      PermissionsEnum.READ_DEPARTMENT,
      PermissionsEnum.READ_DEPARTMENT,
    ],
  },
  {
    title: 'Exemplo 3',
    icon: Shield,
    url: '/security',
    items: [
      {
        title: 'Exemplo 3-1',
        url: '/security/logs',
        icon: Eye,
        permission: [PermissionsEnum.READ_AUDIT_LOG],
      },
      {
        title: 'Exemplo 3-2',
        url: '/security/sessions',
        icon: Activity,
        permission: [],
      },
      {
        title: 'Exemplo 3-3',
        url: '/security/roles',
        icon: KeyRound,
        permission: [],
      },
    ],
  },
]
