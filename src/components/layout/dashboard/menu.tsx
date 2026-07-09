import {
  LayoutDashboard,
  Building2,
  Tag,
  Star,
  MapPin,
  Map,
  Navigation,
  Users2,
  FileText,
  Handshake,
  Briefcase,
  LayoutGrid,
  Shield,
  Activity,
  UserCog,
  KeyRound,
  Eye,
  BadgeDollarSign,
  Receipt,
  BarChart3,
  TrendingUp,
  Wallet,
  Settings,
  Landmark,
  Bell,
  Palette,
  LocateFixed,
  BriefcaseBusiness,
} from 'lucide-react'
import type { NavItem } from './nav-main'
import { PermissionsEnum } from '@/enums/permissions.enum'

// ─── Dashboard ───────────────────────────────────────────
export const DASHBOARD_NAV: NavItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/',
  },
]

export const ADMIN_NAV: NavItem[] = [
  {
    title: 'Administradores',
    icon: UserCog,
    url: '/admins',
    permission: [PermissionsEnum.READ_ADMIN],
  },
  {
    title: 'Departamentos',
    icon: Briefcase,
    url: '/departments',
    permission: [PermissionsEnum.READ_DEPARTMENT,PermissionsEnum.READ_DEPARTMENT],
  },
  {
    title: 'Segurança',
    icon: Shield,
    url: '/security',
    items: [
      {
        title: 'Logs de Acesso',
        url: '/security/logs',
        icon: Eye,
        permission: [PermissionsEnum.READ_AUDIT_LOG],
      },
      {
        title: 'Sessões',
        url: '/security/sessions',
        icon: Activity,
        permission: [],
      },
      {
        title: 'Roles & Acesso',
        url: '/security/roles',
        icon: KeyRound,
        permission: [],
      },
    ],
  },
]

// ─── Imóveis ─────────────────────────────────────────────
// export const IMOVEIS_NAV: NavItem[] = [
//   {
//     title: 'Imóveis',
//     icon: Building2,
//     url: '/imoveis',
//     items: [
//       { title: 'Listagens', url: '/imoveis/listagens', icon: LayoutGrid },
//       { title: 'Categorias', url: '/imoveis/categorias', icon: Tag },
//       { title: 'Destaques', url: '/imoveis/destaques', icon: Star },
//     ],
//   },
//   {
//     title: 'Localização',
//     icon: MapPin,
//     url: '/localizacao',
//     items: [
//       { title: 'Províncias', url: '/localizacao/provincias', icon: Map },
//       { title: 'Municípios', url: '/localizacao/municipios', icon: Navigation },
//       { title: 'Bairros', url: '/localizacao/bairros', icon: LocateFixed },
//     ],
//   },
// ]

// ─── Portais ─────────────────────────────────────────────
// export const PORTAIS_NAV: NavItem[] = [
//   {
//     title: 'Portal do Cliente',
//     icon: Users2,
//     url: '/clientes',
//     items: [
//       { title: 'Clientes', url: '/clientes/lista', icon: Users2 },
//       { title: 'Propostas', url: '/clientes/propostas', icon: FileText },
//       { title: 'Contratos', url: '/clientes/contratos', icon: Handshake },
//     ],
//   },
//   {
//     title: 'Portal do Logista',
//     icon: BriefcaseBusiness,
//     url: '/logistas',
//     items: [
//       { title: 'Agências', url: '/logistas/agencias', icon: Landmark },
//       { title: 'Agentes', url: '/logistas/agentes', icon: UserCog },
//       {
//         title: 'Imóveis Publicados',
//         url: '/logistas/imoveis',
//         icon: Building2,
//       },
//     ],
//   },
// ]

// ─── Finanças ────────────────────────────────────────────
// export const FINANCAS_NAV: NavItem[] = [
//   {
//     title: 'Finanças',
//     icon: Wallet,
//     url: '/financas',
//     items: [
//       { title: 'Faturas', url: '/financas/faturas', icon: Receipt },
//       {
//         title: 'Pagamentos',
//         url: '/financas/pagamentos',
//         icon: BadgeDollarSign,
//       },
//       { title: 'Comissões', url: '/financas/comissoes', icon: TrendingUp },
//       { title: 'Relatórios', url: '/financas/relatorios', icon: BarChart3 },
//     ],
//   },
// ]

// ─── Administração ───────────────────────────────────────

// ─── Configurações ───────────────────────────────────────
// export const CONFIG_NAV: NavItem[] = [
//   {
//     title: 'Configurações',
//     icon: Settings,
//     url: '/configuracoes',
//     items: [
//       { title: 'Geral', url: '/configuracoes/geral', icon: Settings },
//       { title: 'Aparência', url: '/configuracoes/aparencia', icon: Palette },
//       { title: 'Notificações', url: '/configuracoes/notificacoes', icon: Bell },
//       { title: 'Planos', url: '/configuracoes/planos', icon: Star },
//     ],
//   },
// ]
