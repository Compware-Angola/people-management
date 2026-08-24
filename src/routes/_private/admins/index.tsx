import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/admins/')({
  loader:async({context:{queryClient}})=>{
    await loadAccessGuard(
      queryClient,
      PermissionsEnum.CREATE_ADMIN,
    
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private/admins/"!</div>
}
