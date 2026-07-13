import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/$')({
  component: RouteComponent,
})

function RouteComponent() {
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
