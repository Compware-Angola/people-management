import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { FileText } from 'lucide-react'

export const REQUISITIONS_NAV: NavItem[] = [
  {
    title: 'Requisições de Vaga',
    icon: FileText,
    url: '/requisitions',
  },
]
