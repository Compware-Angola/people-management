import { cn } from '@/lib/utils'
import { SidebarHeader, useSidebar } from '../../ui/sidebar'
import { Link } from '@tanstack/react-router'

export function DashboardSidebarHeader() {
  const { open } = useSidebar()
  return (
    <SidebarHeader>
      <Link
        to="/admins"
        className={cn(
          'h-16 shrink-0 flex items-center gap-2.5',
          !open ? 'justify-center px-0' : 'px-5',
        )}
      >
       <img src="/logo.webp" className="size-6 " />
        {open && (
          <div className="flex flex-col min-w-25 animate-in fade-in slide-in-from-left-2 duration-300">
            <p className="text-foreground text-sm font-bold tracking-tight">
              Universidade Metodista
            </p>
            <p className="text-primary text-xs font-medium opacity-80">
             Admin Gestão de Pessoas
            </p>
          </div>
        )}
      </Link>
    </SidebarHeader>
  )
}



