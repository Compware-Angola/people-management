import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { Activity, Fingerprint } from 'lucide-react'

export const BIOMETRICS_NAV: NavItem[] = [
  {
    title: 'Biometria',
    icon: Fingerprint,
    url: '/biometrics',
    items: [{
      title: 'Equipamentos',
      icon: Fingerprint,
      url: '/biometrics/equipments',
    },
    {
      title: 'Eventos Bioméricos',
      icon: Activity,
      url: '/biometrics/events',
    }
    ]
  },
]
