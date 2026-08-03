import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { ClipboardList } from 'lucide-react'

export const APPLICATIONS_NAV: NavItem[] = [
  {
    title: 'Candidatura Docente',
    icon: ClipboardList,
    url: '/applications/teachers',
  },
]
