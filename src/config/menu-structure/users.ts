import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { Users } from 'lucide-react'

export const USERS_NAV: NavItem[] = [
    {
        title: 'Utilizadores',
        icon: Users,
        url: '/users',
        permission: PermissionsEnum.READ_USERS,
    }
]
