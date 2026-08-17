import { StatCard } from '@/components/cards/stats-cards'
import { PageHeader } from '@/components/headers/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { useAttendanceQuery } from '@/hooks/attendance'
import { useDepartmentsQuery } from '@/hooks/departments'
import { useEmployeesQuery } from '@/hooks/employees'
import { useRequisitionsQuery } from '@/hooks/requisitions'
import { useUsersQuery } from '@/hooks/users'
import { useVacanciesQuery } from '@/hooks/vacancies'
import { useVacationsQuery } from '@/hooks/vacations'
import { Link } from '@tanstack/react-router'
import {
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  ClipboardList,
  FileClock,
  Loader2,
  Plane,
  UserRound,
  Users,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'

type StatusCount = {
  label: string
  value: number
}

const statusChartConfig = {
  value: {
    label: 'Total',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

function formatNumber(value?: number) {
  if (value === undefined || Number.isNaN(value)) return '--'

  return new Intl.NumberFormat('pt-AO').format(value)
}

function getTotal(response?: { meta?: { total?: number } }) {
  return response?.meta?.total
}

function getStateLabel(item: {
  state?: { description?: string; acronym?: string }
  status?: string | number
}) {
  if (item.state?.description) return item.state.description
  if (item.state?.acronym) return item.state.acronym
  if (item.status !== undefined) return String(item.status)

  return 'Sem estado'
}

function countByStatus<T extends { state?: unknown; status?: unknown }>(
  rows: T[] | undefined,
  resolver: (row: T) => string,
) {
  const counts = new Map<string, number>()

  rows?.forEach((row) => {
    const label = resolver(row)
    counts.set(label, (counts.get(label) ?? 0) + 1)
  })

  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

function truncateLabel(label: string, maxLength = 18) {
  if (label.length <= maxLength) return label

  return `${label.slice(0, maxLength)}...`
}

function normalizeStatusLabel(label: string) {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function getStatusColor(label: string) {
  const normalizedLabel = normalizeStatusLabel(label)

  if (
    normalizedLabel.includes('aprov') ||
    normalizedLabel.includes('public') ||
    normalizedLabel.includes('ativo') ||
    normalizedLabel.includes('conclu')
  ) {
    return '#16a34a'
  }

  if (
    normalizedLabel.includes('aguard') ||
    normalizedLabel.includes('pend') ||
    normalizedLabel.includes('analise') ||
    normalizedLabel.includes('agend')
  ) {
    return '#f59e0b'
  }

  if (
    normalizedLabel.includes('rejeit') ||
    normalizedLabel.includes('cancel') ||
    normalizedLabel.includes('erro')
  ) {
    return '#dc2626'
  }

  if (
    normalizedLabel.includes('suspend') ||
    normalizedLabel.includes('parcial')
  ) {
    return '#ea580c'
  }

  if (
    normalizedLabel.includes('encerr') ||
    normalizedLabel.includes('inativo') ||
    normalizedLabel.includes('sem estado')
  ) {
    return '#64748b'
  }

  return '#2563eb'
}

function StatusLegend({
  items,
  emptyText,
}: {
  items: StatusCount[]
  emptyText: string
}) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2"
        >
          <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: getStatusColor(item.label) }}
            />
            <span className="truncate">{item.label}</span>
          </span>
          <span className="text-sm font-semibold">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

function StatusBarChart({
  items,
  emptyText,
}: {
  items: StatusCount[]
  emptyText: string
}) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>
  }

  const chartData = items.map((item) => ({
    ...item,
    fill: getStatusColor(item.label),
    shortLabel: truncateLabel(item.label),
  }))

  return (
    <div className="space-y-4">
      <ChartContainer
        config={statusChartConfig}
        className="aspect-auto h-72 w-full"
      >
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -24 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="shortLabel"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
          />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={{ fill: 'rgba(15, 23, 42, 0.06)' }}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, _name, item) => (
                  <>
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: item.payload.fill }}
                    />
                    <span className="text-muted-foreground">
                      {item.payload.label}
                    </span>
                    <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
                      {Number(value).toLocaleString('pt-AO')}
                    </span>
                  </>
                )}
              />
            }
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {chartData.map((item) => (
              <Cell key={item.label} fill={item.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      <StatusLegend items={items} emptyText={emptyText} />
    </div>
  )
}

function StatusDonutChart({
  items,
  emptyText,
}: {
  items: StatusCount[]
  emptyText: string
}) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>
  }

  const chartData = items.map((item) => ({
    ...item,
    fill: getStatusColor(item.label),
  }))

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr] lg:items-center">
      <ChartContainer
        config={statusChartConfig}
        className="aspect-square h-64 w-full"
      >
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="label"
            innerRadius={62}
            outerRadius={94}
            paddingAngle={3}
          >
            {chartData.map((item) => (
              <Cell key={item.label} fill={item.fill} />
            ))}
          </Pie>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, _name, item) => (
                  <>
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: item.payload.fill }}
                    />
                    <span className="text-muted-foreground">
                      {item.payload.label}
                    </span>
                    <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
                      {Number(value).toLocaleString('pt-AO')}
                    </span>
                  </>
                )}
              />
            }
          />
        </PieChart>
      </ChartContainer>
      <StatusLegend items={items} emptyText={emptyText} />
    </div>
  )
}

function RecentList({
  items,
  emptyText,
}: {
  items: Array<{ title: string; subtitle: string; href: string }>
  emptyText: string
}) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Link
          key={`${item.href}-${item.title}`}
          to={item.href}
          className="block rounded-md border bg-muted/30 px-3 py-2 transition-colors hover:bg-muted"
        >
          <p className="text-sm font-medium">{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.subtitle}</p>
        </Link>
      ))}
    </div>
  )
}

function LoadingHint({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null

  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      A atualizar indicadores
    </span>
  )
}

export function TestePage() {
  const employeesQuery = useEmployeesQuery({ page: 1, limit: 1 })
  const usersQuery = useUsersQuery({ page: 1, limit: 1 })
  const departmentsQuery = useDepartmentsQuery({ page: 1, limit: 1, status: 1 })
  const requisitionsQuery = useRequisitionsQuery({ page: 1, limit: 8 })
  const vacanciesQuery = useVacanciesQuery({ page: 1, limit: 8 })
  const vacationsQuery = useVacationsQuery({
    page: 1,
    limit: 1,
    status: 'PENDENTE',
  })
  const attendanceQuery = useAttendanceQuery({ page: 1, limit: 1 })

  const requisitionStatus = countByStatus(
    requisitionsQuery.data?.data,
    (requisition) => getStateLabel(requisition),
  )

  const vacancyStatus = countByStatus(vacanciesQuery.data?.data, (vacancy) =>
    getStateLabel(vacancy),
  )

  const recentRequisitions =
    requisitionsQuery.data?.data.slice(0, 4).map((requisition) => ({
      title: requisition.requisitionCode,
      subtitle: `${requisition.department.description} · ${requisition.state.description}`,
      href: '/requisitions',
    })) ?? []

  const recentVacancies =
    vacanciesQuery.data?.data.slice(0, 4).map((vacancy) => ({
      title: vacancy.vacancyCode,
      subtitle: `${vacancy.position?.description ?? 'Cargo não informado'} · ${
        vacancy.state?.description ?? 'Sem estado'
      }`,
      href: '/vacancies',
    })) ?? []

  const isLoading =
    employeesQuery.isFetching ||
    usersQuery.isFetching ||
    departmentsQuery.isFetching ||
    requisitionsQuery.isFetching ||
    vacanciesQuery.isFetching ||
    vacationsQuery.isFetching ||
    attendanceQuery.isFetching

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral dos principais fluxos de gestão de pessoas"
        actions={<LoadingHint isLoading={isLoading} />}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Colaboradores"
          value={formatNumber(getTotal(employeesQuery.data))}
          icon={Users}
          description="Total registado no sistema"
        />
        <StatCard
          title="Utilizadores"
          value={formatNumber(getTotal(usersQuery.data))}
          icon={UserRound}
          description="Contas disponíveis no GP"
        />
        <StatCard
          title="Departamentos Ativos"
          value={formatNumber(getTotal(departmentsQuery.data))}
          icon={Building2}
          description="Estrutura organizacional ativa"
        />
        <StatCard
          title="Requisições"
          value={formatNumber(getTotal(requisitionsQuery.data))}
          icon={ClipboardList}
          description="Solicitações de vaga registadas"
        />
        <StatCard
          title="Vagas"
          value={formatNumber(getTotal(vacanciesQuery.data))}
          icon={BriefcaseBusiness}
          description="Vagas cadastradas"
        />
        <StatCard
          title="Férias Pendentes"
          value={formatNumber(getTotal(vacationsQuery.data))}
          icon={Plane}
          description="Aguardando tratamento"
        />
        <StatCard
          title="Assiduidade"
          value={formatNumber(getTotal(attendanceQuery.data))}
          icon={CalendarCheck}
          description="Registos de presença"
        />
        <StatCard
          title="Pendências RH"
          value={formatNumber(
            requisitionsQuery.data?.data.filter(
              (item) => item.state.acronym === 'AGUARDANDO_RH',
            ).length,
          )}
          icon={FileClock}
          description="Nas requisições recentes"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Requisições Por Estado</CardTitle>
            <CardDescription>
              Distribuição calculada a partir das requisições recentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatusBarChart
              items={requisitionStatus}
              emptyText="Nenhuma requisição encontrada."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vagas Por Estado</CardTitle>
            <CardDescription>
              Distribuição calculada a partir das vagas recentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatusDonutChart
              items={vacancyStatus}
              emptyText="Nenhuma vaga encontrada."
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Requisições Recentes</CardTitle>
            <CardDescription>
              Últimas solicitações registadas no fluxo de vagas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentList
              items={recentRequisitions}
              emptyText="Nenhuma requisição recente encontrada."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vagas Recentes</CardTitle>
            <CardDescription>
              Últimas vagas cadastradas para acompanhamento do RH.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentList
              items={recentVacancies}
              emptyText="Nenhuma vaga recente encontrada."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
