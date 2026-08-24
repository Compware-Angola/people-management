import { Loader2 } from 'lucide-react'

interface FullPageLoadingProps {
  message?: string
}

export function FullPageLoading({
  message = 'Carregando...',
}: FullPageLoadingProps) {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-8 animate-spin text-primary" />

        <p className="text-sm text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  )
}