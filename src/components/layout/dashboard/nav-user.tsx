import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  User,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
// import { useMeQuery } from '@/pages/profile/hooks/queries'
import { Link } from '@tanstack/react-router'

// import { getInitials } from '@/lib'
import { useAuth } from '@/hooks/auth'

export function NavUser() {
  const { isMobile } = useSidebar()
  // const { logout } = useAuth()

  const handleLogout = async () => {
    // await logout.mutateAsync()
  }

  // const { data: user, isLoading } = useMeQuery()

  // if (isLoading) {
  //   return (
  //     <SidebarMenu>
  //       <SidebarMenuItem>
  //         <SidebarMenuButton size="lg" disabled>
  //           <Skeleton className="h-8 w-8 rounded-lg" />
  //           <div className="grid flex-1 gap-1">
  //             <Skeleton className="h-3 w-24" />
  //             <Skeleton className="h-3 w-32" />
  //           </div>
  //         </SidebarMenuButton>
  //       </SidebarMenuItem>
  //     </SidebarMenu>
  //   )
  // }

  // if (!user) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.avatar ?? undefined}
                  alt={user.fullName}
                />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar> */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{'user.fullName'}</span>
                <span className="truncate text-xs">{'user.email'}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            {/* <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.avatar ?? undefined}
                    alt={user.fullName}
                  />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.fullName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel> */}
            <DropdownMenuSeparator />

            {/* <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/">
                  <User />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleLogout}
              disabled={logout.isPending}
            >
              <LogOut />
              Log out
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
