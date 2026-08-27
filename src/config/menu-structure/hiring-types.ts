import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { ClipboardType } from 'lucide-react'

export const HIRING_TYPES_NAV: NavItem[] = [
  {
    title: 'Tipos de Contratação',
    icon: ClipboardType,
    url: '/hiring-types',
    permission: PermissionsEnum.READ_HIRING_TYPES,
  },
]
