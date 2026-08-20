import { useState } from 'react'
import { FileSignature, Loader2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import {
  useEmployeeActiveContractQuery,
  useEmployeeContractHistoryQuery,
} from '@/hooks/contracts'
import { useEmployeesQuery } from '@/hooks/employees'
import { formatDatePtAO } from '@/lib/date/format-date-pt-ao'
import type {
  Contract,
  ContractEmployee,
  ContractType,
} from '@/services/contracts/contracts.types'
import { ContractStatusBadge } from './contract-status-badge'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatContractType(type?: ContractType) {
  if (!type) return '-'

  const labels: Record<ContractType, string> = {
    CONTRATADO: 'Contratado',
    HORISTA: 'Horista',
    FIXO: 'Fixo',
  }

  return labels[type] ?? type
}

function getContract(record?: ContractEmployee | null): Contract | undefined {
  return record?.contract
}

function formatNullableDate(value?: string | null) {
  return value ? formatDatePtAO(value) : '-'
}

export function EmployeeContractHistoryModal({ open, onOpenChange }: Props) {
  const [employeeId, setEmployeeId] = useState('')
  const selectedEmployeeId = employeeId ? Number(employeeId) : undefined

  const { data: employeesData, isLoading: isLoadingEmployees } =
    useEmployeesQuery({
      page: 1,
      limit: 100,
    })

  const activeContractQuery =
    useEmployeeActiveContractQuery(selectedEmployeeId)
  const historyQuery = useEmployeeContractHistoryQuery(selectedEmployeeId)

  const employeeOptions =
    employeesData?.data.map((employee) => ({
      label: employee.name,
      value: String(employee.id),
    })) ?? []

  const activeContract = getContract(activeContractQuery.data)
  const history = historyQuery.data ?? []
  const isLoadingContracts =
    Boolean(selectedEmployeeId) &&
    (activeContractQuery.isLoading || historyQuery.isLoading)

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setEmployeeId('')
    }

    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contrato do Colaborador</DialogTitle>
          <DialogDescription>
            Consulte o contrato ativo e o histórico contratual de um colaborador.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Colaborador</Label>
            <Select
              value={employeeId}
              onValueChange={setEmployeeId}
              disabled={isLoadingEmployees}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingEmployees
                      ? 'Carregando colaboradores...'
                      : 'Selecionar colaborador'
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {employeeOptions.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    Nenhum colaborador encontrado.
                  </SelectItem>
                ) : (
                  employeeOptions.map((employee) => (
                    <SelectItem key={employee.value} value={employee.value}>
                      {employee.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {!selectedEmployeeId ? (
            <Card className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              Selecione um colaborador para consultar os contratos.
            </Card>
          ) : isLoadingContracts ? (
            <Card className="flex h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando contratos do colaborador...
            </Card>
          ) : (
            <>
              <Card className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <FileSignature className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Contrato ativo</h3>
                </div>

                {activeContractQuery.isError || !activeContractQuery.data ? (
                  <p className="text-sm text-muted-foreground">
                    Este colaborador não possui contrato ativo.
                  </p>
                ) : (
                  <div className="grid gap-3 text-sm md:grid-cols-4">
                    <div>
                      <p className="text-muted-foreground">Tipo</p>
                      <p className="font-medium">
                        {formatContractType(activeContract?.type)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Horas mensais</p>
                      <p className="font-medium">
                        {activeContract?.monthlyHours ?? '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Hora extra</p>
                      <p className="font-medium">
                        {activeContract?.allowsOvertime === 1
                          ? 'Permite'
                          : 'Não permite'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Início</p>
                      <p className="font-medium">
                        {formatNullableDate(activeContractQuery.data.startDate)}
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              <Card>
                <div className="border-b p-4">
                  <h3 className="font-semibold">Histórico de contratos</h3>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Horas mensais</TableHead>
                        <TableHead>Hora extra</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Data início</TableHead>
                        <TableHead>Data fim</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {history.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="h-24 text-center text-sm text-muted-foreground"
                          >
                            Nenhum histórico encontrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        history.map((record) => {
                          const contract = getContract(record)

                          return (
                            <TableRow key={record.id}>
                              <TableCell>
                                {formatContractType(contract?.type)}
                              </TableCell>
                              <TableCell>
                                {contract?.monthlyHours ?? '-'}
                              </TableCell>
                              <TableCell>
                                {contract?.allowsOvertime === 1
                                  ? 'Permite'
                                  : 'Não permite'}
                              </TableCell>
                              <TableCell>
                                <ContractStatusBadge status={record.status} />
                              </TableCell>
                              <TableCell>
                                {formatNullableDate(record.startDate)}
                              </TableCell>
                              <TableCell>
                                {formatNullableDate(record.endDate)}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
