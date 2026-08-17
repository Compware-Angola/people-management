import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'

import { TableCell, TableRow } from '@/components/ui/table'

type TableStateProps = {
  columns: number
  icon: ComponentType<LucideProps>
  title: string
  description?: string
}

export function TableErrorState({
  columns,
  icon: Icon,
  title,
  description = 'Não foi possível buscar os dados. Tente novamente mais tarde.',
}: TableStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={columns} className="h-40 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Icon className="h-8 w-8 text-destructive" />
          <span className="font-medium text-destructive">{title}</span>
          <span className="text-sm">{description}</span>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function TableEmptyState({
  columns,
  icon: Icon,
  title,
}: Omit<TableStateProps, 'description'>) {
  return (
    <TableRow>
      <TableCell colSpan={columns} className="h-32 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Icon className="h-8 w-8" />
          <span>{title}</span>
        </div>
      </TableCell>
    </TableRow>
  )
}
