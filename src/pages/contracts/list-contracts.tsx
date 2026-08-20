import { useMemo, useState } from 'react'
import {
  FileSignature,
  History,
  Pencil,
  Plus,
  RefreshCcw,
  UserPlus,
} from 'lucide-react'

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Pagination } from '@/components/table/pagination'
import { TableEmptyState, TableErrorState } from '@/components/table/table-state'
import { TableGroupRowSkeleton } from '@/components/table/table-skeleton'
import { useContractsQuery } from '@/hooks/contracts'
import { formatDatePtAO } from '@/lib/date/format-date-pt-ao'
import { cn } from '@/lib/utils'
import type {
  Contract,
  ContractStatus,
  ContractType,
} from '@/services/contracts/contracts.types'
import { ContractAssignmentModal } from './components/contract-assignment-modal'
import { ContractFormModal } from './components/contract-form-modal'
import { ContractStatusBadge } from './components/contract-status-badge'
import { EmployeeContractHistoryModal } from './components/employee-contract-history-modal'

function formatContractType(type: ContractType) {
  const labels: Record<ContractType, string> = {
    CONTRATADO: 'Contratado',
    HORISTA: 'Horista',
    FIXO: 'Fixo',
  }

  return labels[type] ?? type
}

export function ListContracts() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [id, setId] = useState('')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [assigningContract, setAssigningContract] =
    useState<Contract | null>(null)
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  const { data, isLoading, isError, refetch, isFetching } = useContractsQuery({
    page,
    limit,
    ...(id ? { id: Number(id) } : {}),
    ...(type !== 'all' ? { type: type as ContractType } : {}),
    ...(status !== 'all' ? { status: status as ContractStatus } : {}),
  })

  const contractRecords = useMemo(() => data?.data ?? [], [data])
  const meta = data?.meta
  const total = meta?.total ?? 0
  const totalPages = meta?.totalPages ?? 1
  const currentPage = meta?.page ?? page
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const rangeEnd = Math.min(currentPage * limit, total)
  const loading = isLoading || isFetching

  function resetPage() {
    setPage(1)
  }

  function openCreateModal() {
    setEditingContract(null)
    setIsModalOpen(true)
  }

  function openEditModal(contract: Contract) {
    setEditingContract(contract)
    setIsModalOpen(true)
  }

  function openAssignmentModal(contract: Contract) {
    setAssigningContract(contract)
    setIsAssignmentModalOpen(true)
  }

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
                <BreadcrumbPage>Contratos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">
            Consultar e gerir contratos usados nos fluxos dos colaboradores
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsHistoryModalOpen(true)}>
            <History className="mr-2 h-4 w-4" />
            Histórico
          </Button>

          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCcw
              className={cn(
                'mr-2 h-4 w-4',
                !isLoading && isFetching && 'animate-spin',
              )}
            />
            Atualizar
          </Button>

          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Contrato
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Código</Label>
            <Input
              value={id}
              onChange={(event) => {
                setId(event.target.value)
                resetPage()
              }}
              type="number"
              min="1"
              placeholder="Pesquisar por código"
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={type}
              onValueChange={(value) => {
                setType(value)
                resetPage()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="CONTRATADO">Contratado</SelectItem>
                <SelectItem value="HORISTA">Horista</SelectItem>
                <SelectItem value="FIXO">Fixo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value)
                resetPage()
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="ATIVO">Ativo</SelectItem>
                <SelectItem value="INATIVO">Inativo</SelectItem>
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
                <TableHead>Tipo</TableHead>
                <TableHead>Horas mensais</TableHead>
                <TableHead>Hora extra</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableGroupRowSkeleton rows={10} columns={7} />
              ) : isError ? (
                <TableErrorState
                  columns={7}
                  icon={FileSignature}
                  title="Erro ao carregar contratos"
                />
              ) : contractRecords.length === 0 ? (
                <TableEmptyState
                  columns={7}
                  icon={FileSignature}
                  title="Nenhum contrato encontrado."
                />
              ) : (
                contractRecords.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>{contract.id}</TableCell>
                    <TableCell className="font-medium">
                      {formatContractType(contract.type)}
                    </TableCell>
                    <TableCell>{contract.monthlyHours}</TableCell>
                    <TableCell>
                      {contract.allowsOvertime === 1 ? 'Permite' : 'Não permite'}
                    </TableCell>
                    <TableCell>
                      <ContractStatusBadge status={contract.status} />
                    </TableCell>
                    <TableCell>{formatDatePtAO(contract.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(contract)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar contrato</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openAssignmentModal(contract)}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Atribuir contrato ao colaborador
                          </TooltipContent>
                        </Tooltip>
                      </div>
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

      <ContractFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        contract={editingContract}
      />

      <ContractAssignmentModal
        open={isAssignmentModalOpen}
        onOpenChange={(open) => {
          setIsAssignmentModalOpen(open)

          if (!open) {
            setAssigningContract(null)
          }
        }}
        contract={assigningContract}
      />

      <EmployeeContractHistoryModal
        open={isHistoryModalOpen}
        onOpenChange={setIsHistoryModalOpen}
      />
    </div>
  )
}
