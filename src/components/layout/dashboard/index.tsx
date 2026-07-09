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
import { ADMIN_NAV, DASHBOARD_NAV } from './menu'

export function DashboardLayout({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" {...props}>
        <DashboardSidebarHeader />

        <SidebarContent>
          <NavMain items={DASHBOARD_NAV}  />
          <NavMain items={ADMIN_NAV} groupLabel="Administração" />
          {/* <NavMain items={IMOVEIS_NAV} groupLabel="Imóveis" />
          <NavMain items={PORTAIS_NAV} groupLabel="Portais" />
          <NavMain items={FINANCAS_NAV} groupLabel="Financeiro" />
          <NavMain items={CONFIG_NAV} groupLabel="Sistema" /> */}
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
