import { useState } from 'react'
import { Fingerprint, Pencil } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Pagination } from '@/components/table/pagination'
import { TableGroupRowSkeleton } from '@/components/table/table-skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useBiometricEquipmentsQuery } from '@/hooks/biometrics'
import type { BiometricEquipment } from '@/services/biometrics/biometrics.types'
import { NumericStatusBadge } from './status-badge'

function emptyValue(value?: string | number | null) {
  if (value === null || value === undefined || value === '') return '-'

  return value
}

function formatDate(value?: string | null) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

type Props = {
  onEdit: (equipment: BiometricEquipment) => void
  canEdit?: boolean
}

export function EquipmentsTable({ onEdit, canEdit = true }: Props) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data, isLoading, isError, isFetching } = useBiometricEquipmentsQuery({
    page,
    limit,
  })

  const equipments = data?.data ?? []
  const meta = data?.meta
  const total = meta?.total ?? 0
  const totalPages = meta?.totalPages ?? 1
  const currentPage = meta?.page ?? page
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const rangeEnd = Math.min(currentPage * limit, total)
  const loading = isLoading || isFetching

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableGroupRowSkeleton rows={10} columns={7} />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Fingerprint className="h-8 w-8 text-destructive" />
                    <span className="font-medium text-destructive">
                      Erro ao carregar equipamentos
                    </span>
                    <span className="text-sm">
                      Não foi possível buscar os dados.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : equipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Fingerprint className="h-8 w-8" />
                    <span>Nenhum equipamento encontrado.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              equipments.map((equipment) => (
                <TableRow key={equipment.id}>
                  <TableCell>{equipment.id}</TableCell>
                  <TableCell className="font-medium">
                    {equipment.name}
                  </TableCell>
                  <TableCell>{emptyValue(equipment.location)}</TableCell>
                  <TableCell>{emptyValue(equipment.model)}</TableCell>
                  <TableCell>
                    <NumericStatusBadge status={equipment.status} />
                  </TableCell>
                  <TableCell>{formatDate(equipment.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    {canEdit && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(equipment)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar equipamento</TooltipContent>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        total={total}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        limit={limit}
        loading={isLoading}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value)
          setPage(1)
        }}
      />
    </Card>
  )
}
