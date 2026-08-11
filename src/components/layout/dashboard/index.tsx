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
  COST_CENTERS_NAV,
  DASHBOARD_NAV,
  DEPARTMENTS_NAV,
  EMPLOYEES_NAV,
  POSITIONS_NAV,
  REQUISITIONS_NAV,
  USERS_NAV,
  VACATIONS_NAV,
  VACANCIES_NAV,
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
          <NavMain items={EMPLOYEES_NAV} />
          <NavMain items={USERS_NAV} />
          <NavMain items={DEPARTMENTS_NAV} />
          <NavMain items={COST_CENTERS_NAV} />
          <NavMain items={POSITIONS_NAV} />
          <NavMain items={REQUISITIONS_NAV} />
          <NavMain items={VACANCIES_NAV} />
          <NavMain items={ATTENDANCE_NAV} />
          <NavMain items={VACATIONS_NAV} />
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
