import { useRef } from 'react'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'

interface EmployeeFiltersProps {
  search: string
  onSearchChange: (value: string) => void
}

export function EmployeeFilters({
  search,
  onSearchChange,
}: EmployeeFiltersProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="border-b p-4">
      <div className="relative w-full md:max-w-md">
        <div
          className="absolute left-0 top-0 flex h-full w-10 items-center justify-center cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>

        <Input
          ref={inputRef}
          value={search}
          placeholder="Pesquisar..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  )
}
