import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  beforeLoad: ({ context }) => {
    if (context.authStorage.isAuthenticated()) {
      throw redirect({ to: '/' })
    }
  },
  component: () => <Outlet />,
})
