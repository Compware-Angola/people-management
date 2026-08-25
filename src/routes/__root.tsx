import { HeadContent, Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { FormDevtoolsPanel } from '@tanstack/react-form-devtools'
import '../styles.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from 'sonner'
import type { QueryClient } from '@tanstack/react-query'
import type { authStorage } from '@/lib/auth/auth-storage'
import { FullPageLoading } from '@/components/loading'

interface RouterContext {
  queryClient: QueryClient
  authStorage: typeof authStorage
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    title: 'Gestão de Pessoas',

    meta: [
      {
        charSet: 'UTF-8',
      },
      {
        httpEquiv: 'X-UA-Compatible',
        content: 'IE=edge',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
      },
      {
        name: 'description',
        content:
          'Sistema moderno para gestão de pessoas, colaboradores e recursos humanos.',
      },
      {
        name: 'keywords',
        content:
          'Gestão de Pessoas, Recursos Humanos, RH, Funcionários, Colaboradores, Dashboard',
      },
      {
        name: 'author',
        content: 'Sua Empresa',
      },
      {
        name: 'robots',
        content: 'index,follow',
      },
      {
        name: 'theme-color',
        content: '#eb2c25ff',
      },
      {
        name: 'color-scheme',
        content: 'light dark',
      },

      // Open Graph
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:locale',
        content: 'pt_PT',
      },
      {
        property: 'og:site_name',
        content: 'Gestão de Pessoas',
      },
      {
        property: 'og:title',
        content: 'Gestão de Pessoas',
      },
      {
        property: 'og:description',
        content: 'Sistema moderno para gestão de pessoas e recursos humanos.',
      },
      {
        property: 'og:image',
        content: '/logo_uma.webp',
      },
      {
        property: 'og:url',
        content: 'https://teudominio.com/',
      },

      // Twitter
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Gestão de Pessoas',
      },
      {
        name: 'twitter:description',
        content: 'Sistema moderno para gestão de pessoas e recursos humanos.',
      },
      {
        name: 'twitter:image',
        content: '/logo_uma.webp',
      },
      {
        name: 'twitter:url',
        content: 'https://teudominio.com/',
      },

      // Microsoft
      {
        name: 'msapplication-TileColor',
        content: '#2563eb',
      },
      {
        name: 'msapplication-config',
        content: '/browserconfig.xml',
      },
    ],

    links: [
      {
        rel: 'icon',
        href: '/favicon.ico',
        sizes: 'any',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'canonical',
        href: 'https://teudominio.com/',
      },
      {
        rel: 'manifest',
        href: '/manifest.webmanifest',
      },
    ],
  }),
  component: RootComponent,
  pendingComponent:FullPageLoading,

})

function RootComponent() {
  return (
    <>
      <HeadContent />

      <TooltipProvider>
        <Outlet />
        <Toaster richColors position="bottom-right" closeButton />
      </TooltipProvider>

      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          {
            name: 'TanStack Query',
            render: <ReactQueryDevtoolsPanel />,
          },
          {
            name: 'TanStack Form',
            render: <FormDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
