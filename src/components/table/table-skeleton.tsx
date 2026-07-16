import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export function TableGroupRowSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
      <>
        {Array.from({ length: rows }).map((_, row) => (
          <TableRow key={row}>
            {Array.from({ length: columns }).map((_, column) => (
              <TableCell key={column}>
                <Skeleton className="h-5 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
  )
}
