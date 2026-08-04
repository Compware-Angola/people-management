import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { Fingerprint } from 'lucide-react'

export const BIOMETRICS_NAV: NavItem[] = [
  {
    title: 'Biometria',
    icon: Fingerprint,
    url: '/biometrics',
  },
]
