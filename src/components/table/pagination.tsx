import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
  loading: boolean
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
}: PaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-border p-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
      <span>
        {total === 0
          ? '0 resultados'
          : `A mostrar ${rangeStart}–${rangeEnd} de ${total}`}
      </span>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span>Itens por página</span>

          <Select
            value={String(limit)}
            onValueChange={(value) => onLimitChange(Number(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Anterior
          </Button>

          <span className="text-foreground">
            Página {page} de {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
          >
            Seguinte
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
