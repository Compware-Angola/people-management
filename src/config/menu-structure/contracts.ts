import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { FileSignature } from 'lucide-react'

export const CONTRACTS_NAV: NavItem[] = [
  {
    title: 'Contratos',
    icon: FileSignature,
    url: '/contracts',
  },
]
