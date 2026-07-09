
import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useLocation, Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

type SubItem = {
  title: string
  url: string
  icon?: LucideIcon
}

type Props = {
  title: string
  url: string
  icon?: LucideIcon
  items: Array<SubItem>
}

export function NavItemWithChildren({ title, url, icon: Icon, items }: Props) {
  const location = useLocation()
  const { state, isMobile, toggleSidebar } = useSidebar()
  const handleNavigate = () => {
    if (isMobile) {
      toggleSidebar()
    }
  }

  const pathname = location.pathname
  const isRouteActive =
    url === '/' ? pathname === '/' : pathname.startsWith(url)
  const [open, setOpen] = useState(() => isRouteActive)

  // ── Collapsed ────────────────────────────────────────────────────────────
  if (state === 'collapsed') {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={title}
              className={cn(
                'transition-colors',
                isRouteActive &&
                  'bg-primary text-primary-foreground hover:bg-primary/90',
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              <span>{title}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="right" align="start" className="min-w-48">
            <DropdownMenuLabel>{title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {items.map((sub) => {
              const active = pathname === sub.url
              return (
                <DropdownMenuItem key={sub.url} asChild>
                  <Link
                    preload="intent"
                    to={sub.url}
                    onClick={handleNavigate}
                    className={cn(
                      'cursor-pointer gap-2',
                      active && 'bg-primary text-primary-foreground ',
                    )}
                  >
                    {sub.icon && <sub.icon className="h-4 w-4 shrink-0" />}
                    {sub.title}
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="group/collapsible w-full"
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={title}
            className={cn(
              'w-full transition-colors',
              isRouteActive &&
                'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            {Icon && <Icon className="mr-2 h-4 w-4 shrink-0" />}
            <span className="flex-1">{title}</span>
            <ChevronRight
              className={cn(
                'ml-2 h-4 w-4 transition-transform duration-200',
                open && 'rotate-90',
              )}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((sub) => {
              const active = pathname === sub.url
              return (
                <SidebarMenuSubItem key={sub.url}>
                  <SidebarMenuSubButton
                    asChild
                    className={cn(
                      'transition-colors',
                      active &&
                        'bg-primary text-primary-foreground hover:bg-primary/90',
                    )}
                  >
                    <Link
                      to={sub.url}
                      preload="intent"
                      onClick={handleNavigate}
                    >
                      {sub.icon && <sub.icon className="mr-2 h-4 w-4" />}
                      <span>{sub.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
