import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout/dashboard'

export const Route = createFileRoute('/_private')({
  component: RouteComponent,
  notFoundComponent: () => <NotFoundPrivate />,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}

function NotFoundPrivate() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">
        Página não encontrada dentro do painel.
      </p>
      <Link to="/" className="text-primary underline">
        Voltar ao início
      </Link>
    </div>
  )
}
