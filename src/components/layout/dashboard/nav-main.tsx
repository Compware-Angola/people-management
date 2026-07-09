'use client'

import { useMemo } from 'react'
import { useLocation, Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

import { NavItemWithChildren } from './nav-item-with-children'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'


import type { PermissionsEnum } from '@/enums/permissions.enum'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/auth'


export type NavItem = {
  title: string
  url: string
  permission?: PermissionsEnum | PermissionsEnum[]
  icon?: LucideIcon
  items?: Array<{
    title: string
    url: string
    permission?: PermissionsEnum | PermissionsEnum[]
    icon?: LucideIcon
  }>
}

function filterNavItems(
  items: NavItem[],
  can: (perm: PermissionsEnum | PermissionsEnum[]) => boolean,
): NavItem[] {
  return items
    .map((item) => {
      if (item.items?.length) {
        const filteredChildren = item.items.filter((child) =>
          child.permission ? can(child.permission) : true,
        )

        if (filteredChildren.length === 0) return null

        return {
          ...item,
          items: filteredChildren,
        }
      }

      if (item.permission && !can(item.permission)) {
        return null
      }

      return item
    })
    .filter(Boolean) as NavItem[]
}

type Props = {
  items: NavItem[]
  groupLabel?: string
}

export function NavMain({ items, groupLabel }: Props) {
  const location = useLocation()
  const pathname = location.pathname
  const { isMobile, toggleSidebar } = useSidebar()
  const handleNavigate = () => {
    if (isMobile) {
      toggleSidebar()
    }
  }

  const { can } = useAuth()

  const filteredItems = useMemo(() => {
    return filterNavItems(items, can)
  }, [items, can])

  if (filteredItems.length === 0) return null

  return (
    <SidebarGroup>
      {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}

      <SidebarMenu>
        {filteredItems.map((item) => {
          if (item.items?.length) {
            return (
              <NavItemWithChildren
                key={item.title}
                title={item.title}
                url={item.url}
                icon={item.icon}
                items={item.items}
              />
            )
          }

          const isActive =
            item.url === '/' ? pathname === '/' : pathname.startsWith(item.url)

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={cn(
                  'transition-colors',
                  isActive &&
                    'bg-primary text-primary-foreground hover:bg-primary/90',
                )}
              >
                <Link to={item.url} preload="intent" onClick={handleNavigate}>
                  {item.icon && <item.icon className="mr-2 h-4 w-4 shrink-0" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
