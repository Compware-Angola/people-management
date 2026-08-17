import { useMemo, useState } from 'react'
import { KeyRound, RefreshCcw } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableGroupRowSkeleton } from '@/components/table/table-skeleton'
import { usePermissionsQuery } from '@/hooks/permissions'
import { cn } from '@/lib/utils'
import { PermissionStatusBadge } from './components/permission-status-badge'

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

export function ListPermissions() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const { data = [], isLoading, isError, refetch, isFetching } =
    usePermissionsQuery()

  const filteredPermissions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return data.filter((permission) => {
      const matchesSearch =
        !normalizedSearch ||
        permission.description.toLowerCase().includes(normalizedSearch)

      const matchesStatus =
        status === 'all' || String(permission.status) === status

      return matchesSearch && matchesStatus
    })
  }, [data, search, status])

  const loading = isLoading || isFetching

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Permissões</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">Permissões</h1>
          <p className="text-muted-foreground">
            Consultar permissões individuais do sistema
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCcw
              className={cn(
                'mr-2 h-4 w-4',
                !isLoading && isFetching && 'animate-spin',
              )}
            />
            Atualizar
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Descrição da permissão</Label>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar por descrição"
            />
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="1">Ativa</SelectItem>
                <SelectItem value="0">Inativa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Criada em</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableGroupRowSkeleton rows={10} columns={4} />
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <KeyRound className="h-8 w-8 text-destructive" />
                      <span className="font-medium text-destructive">
                        Erro ao carregar permissões
                      </span>
                      <span className="text-sm">
                        Não foi possível buscar os dados. Tente novamente mais
                        tarde.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredPermissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <KeyRound className="h-8 w-8" />
                      <span>Nenhuma permissão encontrada.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPermissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell>{permission.id}</TableCell>
                    <TableCell className="font-medium">
                      {permission.description}
                    </TableCell>
                    <TableCell>
                      <PermissionStatusBadge status={permission.status} />
                    </TableCell>
                    <TableCell>{formatDate(permission.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
