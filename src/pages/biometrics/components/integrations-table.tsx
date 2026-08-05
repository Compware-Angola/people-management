import { useState } from 'react'
import { Activity } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
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
import { useBiometricIntegrationsQuery } from '@/hooks/biometrics'
import { NumericStatusBadge } from './status-badge'

function formatDate(value?: string | null) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function IntegrationsTable() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data, isLoading, isError, isFetching } =
    useBiometricIntegrationsQuery({
      page,
      limit,
    })

  const integrations = data?.data ?? []
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
              <TableHead>Colaborador</TableHead>
              <TableHead>Equipamento</TableHead>
              <TableHead>Evento</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Criado em</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableGroupRowSkeleton rows={10} columns={6} />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Activity className="h-8 w-8 text-destructive" />
                    <span className="font-medium text-destructive">
                      Erro ao carregar eventos biométricos
                    </span>
                    <span className="text-sm">
                      Não foi possível buscar os dados.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : integrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Activity className="h-8 w-8" />
                    <span>Nenhum evento biométrico encontrado.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              integrations.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell>{integration.id}</TableCell>
                  <TableCell className="font-medium">
                    {integration.employeeName ??
                      `Colaborador #${integration.employeeId}`}
                  </TableCell>
                  <TableCell>{integration.equipmentName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{integration.event}</Badge>
                  </TableCell>
                  <TableCell>
                    <NumericStatusBadge status={integration.status} />
                  </TableCell>
                  <TableCell>{formatDate(integration.createdAt)}</TableCell>
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
