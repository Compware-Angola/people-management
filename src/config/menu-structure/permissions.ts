import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { KeyRound } from 'lucide-react'

export const PERMISSIONS_NAV: NavItem[] = [
  {
    title: 'Permissões',
    icon: KeyRound,
    url: '/permissions',
  },
]
