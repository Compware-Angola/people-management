import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  SidebarProvider,
  SidebarInset,
  SidebarFooter,
} from '../../ui/sidebar'
import { Header } from './header'
import { NavMain } from './nav-main'
import { DashboardSidebarHeader } from './sidebar-header'
import { NavUser } from './nav-user'
import { DASHBOARD_NAV, EXAMPLE_NAV } from '@/config/menu-structure'


export function DashboardLayout({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" {...props}>
        <DashboardSidebarHeader />
        <SidebarContent>
          <NavMain items={DASHBOARD_NAV} />
          <NavMain items={EXAMPLE_NAV} groupLabel="Exemplo" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
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
