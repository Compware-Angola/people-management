import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { PAGE_SIZE_OPTIONS } from '@/constants'

export interface PaginationProps {
  page: number
  totalPages: number
  total: number
  rangeStart: number
  rangeEnd: number
  limit: number
  onLimitChange: (limit: number) => void
  onPageChange: (page: number) => void
  onPageHover?: (page: number) => void
  loading: boolean
}

const DOTS = 'dots' as const

function getPageNumbers(
  page: number,
  totalPages: number,
): Array<number | typeof DOTS> {
  const siblingCount = 1
  const totalVisible = siblingCount * 2 + 5

  if (totalVisible >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSibling = Math.max(page - siblingCount, 1)
  const rightSibling = Math.min(page + siblingCount, totalPages)

  const showLeftDots = leftSibling > 2
  const showRightDots = rightSibling < totalPages - 1

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => i + 1,
    )

    return [...leftRange, DOTS, totalPages]
  }

  if (showLeftDots && !showRightDots) {
    const rightCount = 3 + siblingCount * 2

    const rightRange = Array.from(
      { length: rightCount },
      (_, i) => totalPages - rightCount + 1 + i,
    )

    return [1, DOTS, ...rightRange]
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i,
  )

  return [1, DOTS, ...middleRange, DOTS, totalPages]
}

export function Pagination({
  page,
  totalPages,
  total,
  rangeStart,
  rangeEnd,
  limit,
  loading,
  onLimitChange,
  onPageChange,
  onPageHover,
}: PaginationProps) {
  const pageNumbers = getPageNumbers(
    page,
    Math.max(totalPages, 1),
  )

  const hasPreviousPage = page > 1
  const hasNextPage = page < totalPages

  return (
    <div className="flex flex-col gap-3 border-t border-border p-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
      <span>
        {total === 0
          ? '0 resultados'
          : `A mostrar ${rangeStart}–${rangeEnd} de ${total}`}
      </span>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 md:flex">
          <span>Itens por página</span>

          <Select
            value={String(limit)}
            onValueChange={(value) =>
              onLimitChange(Number(value))
            }
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-start">
          {/* Anterior */}
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Anterior"
            disabled={!hasPreviousPage || loading}
            onClick={() => {
              if (!hasPreviousPage || loading) return

              onPageChange(page - 1)
            }}
            onMouseEnter={() => {
              if (hasPreviousPage) {
                onPageHover?.(page - 1)
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Mobile */}
          <span className="text-foreground md:hidden">
            Página {page} de {totalPages}
          </span>

          {/* Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {pageNumbers.map((pageNumber, index) =>
              pageNumber === DOTS ? (
                <span
                  key={`dots-${index}`}
                  className="flex size-8 items-center justify-center text-muted-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <Button
                  key={pageNumber}
                  variant={
                    pageNumber === page
                      ? 'default'
                      : 'outline'
                  }
                  size="sm"
                  className={cn(
                    'w-8 px-0',
                    pageNumber === page &&
                      'pointer-events-none',
                  )}
                  disabled={loading}
                  aria-current={
                    pageNumber === page
                      ? 'page'
                      : undefined
                  }
                  onMouseEnter={() => {
                    if (pageNumber !== page) {
                      onPageHover?.(pageNumber)
                    }
                  }}
                  onClick={() => {
                    if (pageNumber !== page) {
                      onPageChange(pageNumber)
                    }
                  }}
                >
                  {pageNumber}
                </Button>
              ),
            )}
          </div>

          {/* Seguinte */}
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Seguinte"
            disabled={!hasNextPage || loading}
            onMouseEnter={() => {
              if (hasNextPage) {
                onPageHover?.(page + 1)
              }
            }}
            onClick={() => {
              if (!hasNextPage || loading) return

              onPageChange(page + 1)
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}