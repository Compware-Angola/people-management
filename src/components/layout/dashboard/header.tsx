// import ThemeToggle from '../../common/theme-toggle'
import { SidebarTrigger } from '../../ui/sidebar'
import { UserMenu } from './user-menu'

export function Header() {
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 md:px-6">
          <SidebarTrigger className="-ml-1" />

          <div className="ml-auto flex items-center gap-2 md:gap-4">
            {/* <ThemeToggle /> */}
            <UserMenu />
          </div>
        </div>
      </header>
    </>
  )
}
