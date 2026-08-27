import type React from 'react'
import { ScrollArea, ScrollBar } from './ui/scroll-area'

export function Toolbar({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea className="min-w-64 whitespace-nowrap">
      <div className="flex w-max space-x-4 py-2">{children}</div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
