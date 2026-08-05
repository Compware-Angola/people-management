import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  SidebarProvider,
  SidebarInset,
} from '../../ui/sidebar'
import { Header } from './header'
import { NavMain } from './nav-main'
import { DashboardSidebarHeader } from './sidebar-header'
import {
  ATTENDANCE_NAV,
  BIOMETRICS_NAV,
  DASHBOARD_NAV,
  EMPLOYEES_NAV,
  LEAVES_NAV,
  VACATIONS_NAV,
} from '@/config/menu-structure'

export function DashboardLayout({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" {...props}>
        <DashboardSidebarHeader />
        <SidebarContent>
          <NavMain items={DASHBOARD_NAV} />
          <NavMain items={EMPLOYEES_NAV} groupLabel="Colaboradores" />
          <NavMain items={ATTENDANCE_NAV} groupLabel="Assiduidade" />
          <NavMain items={VACATIONS_NAV} groupLabel="Férias" />
          <NavMain items={LEAVES_NAV} groupLabel="Licenças" />
          <NavMain items={BIOMETRICS_NAV} groupLabel="Biometria" />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <Header />
        <div className="my-20 mx-auto max-w-384 w-full px-2 md:px-2 @container/main">
          {props.children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
