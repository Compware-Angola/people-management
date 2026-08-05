import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { ClipboardCheck } from 'lucide-react'

export const LEAVES_NAV: NavItem[] = [
  {
    title: 'Registros de Licenças',
    icon: ClipboardCheck,
    url: '/leaves',
  },
]
