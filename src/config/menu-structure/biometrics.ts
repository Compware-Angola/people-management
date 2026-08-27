import type { NavItem } from '@/components/layout/dashboard/nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { Activity, Fingerprint } from 'lucide-react'

export const BIOMETRICS_NAV: NavItem[] = [
  {
    title: 'Biometria',
    icon: Fingerprint,
    url: '/biometrics',
    permission: PermissionsEnum.READ_BIOMETRICS,
    items: [{
      title: 'Equipamentos',
      icon: Fingerprint,
      url: '/biometrics/equipments',
      permission: PermissionsEnum.READ_BIOMETRICS,
    },
    {
      title: 'Eventos Bioméricos',
      icon: Activity,
      url: '/biometrics/events',
      permission: PermissionsEnum.READ_BIOMETRICS,
    }
    ]
  },
]
