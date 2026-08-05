import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/biometrics')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/biometrics') {
      throw redirect({
        to: '/biometrics/equipments',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}