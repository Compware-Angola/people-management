import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { ClipboardList } from 'lucide-react'

export const VACANCIES_NAV: NavItem[] = [
  {
    title: 'Vagas',
    icon: ClipboardList,
    url: '/vacancies',
    permission: PermissionsEnum.READ_VACANCIES,
  },
]
