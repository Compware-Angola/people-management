type AuthLayoutProps = {
  title: string
  description?: string
  children: React.ReactNode
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src="/logo_uma.webp" className="h-30 w-60" alt="Logo UMA" />

          <h1 className="mt-4 text-2xl font-semibold">{title}</h1>

          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="rounded-lg border bg-card p-8 shadow-sm sm:p-10">
          {children}
        </div>
      </div>
    </div>
  )
}
