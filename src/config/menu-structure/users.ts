import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { Users } from 'lucide-react'

export const USERS_NAV: NavItem[] = [
    {
        title: 'Utilizadores',
        icon: Users,
        url: '/users',
    }
]
