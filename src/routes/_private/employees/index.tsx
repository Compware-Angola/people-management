import { Link, createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { useQueryEmployees } from '@/hooks/employees/use-query-employees'

export const Route = createFileRoute('/_private/employees/')({
  component: EmployeesPage,
})

function EmployeesPage() {
  const { data, isLoading, isError } = useQueryEmployees()

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Colaboradores</h1>
          <p className="text-sm text-muted-foreground">
            Listagem geral de colaboradores cadastrados.
          </p>
        </div>

        <Button asChild>
          <Link to="/employees/create">Novo colaborador</Link>
        </Button>
      </div>

      {isLoading && (
        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          A carregar colaboradores...
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive/30 p-4 text-sm text-destructive">
          Não foi possível carregar os colaboradores.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Nome</th>
                <th className="px-3 py-2 text-left font-medium">BI</th>
                <th className="px-3 py-2 text-left font-medium">Telefone</th>
                <th className="px-3 py-2 text-left font-medium">Email</th>
                <th className="px-3 py-2 text-left font-medium">Província</th>
                <th className="px-3 py-2 text-left font-medium">Município</th>
                <th className="px-3 py-2 text-left font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((employee) => (
                <tr key={employee.id} className="border-t">
                  <td className="px-3 py-2">{employee.name}</td>
                  <td className="px-3 py-2">{employee.bi}</td>
                  <td className="px-3 py-2">{employee.phone}</td>
                  <td className="px-3 py-2">{employee.email}</td>
                  <td className="px-3 py-2">{employee.province}</td>
                  <td className="px-3 py-2">{employee.municipality}</td>
                  <td className="px-3 py-2">
                    {employee.status === 1 ? 'Ativo' : 'Inativo'}
                  </td>
                </tr>
              ))}

              {data?.data.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-8 text-center text-muted-foreground"
                  >
                    Nenhum colaborador encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
