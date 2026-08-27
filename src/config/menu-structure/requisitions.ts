import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { FileText } from 'lucide-react'

export const REQUISITIONS_NAV: NavItem[] = [
  {
    title: 'Requisições de Vaga',
    icon: FileText,
    url: '/requisitions',
    permission: PermissionsEnum.READ_REQUISITIONS,
  },
]
