import { ListAttendance } from '@/pages/attendance/list-attendance'
import { PermissionsEnum } from '@/enums/permissions.enum'
import { loadAccessGuard } from '@/utils/access-route-guard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/attendance/')({
  loader: async ({ context: { queryClient } }) => {
    await loadAccessGuard(queryClient, PermissionsEnum.READ_ATTENDANCE)
  },
  head: () => ({
    meta: [
      { title: 'Assiduidade' },
      {
        name: 'description',
        content: 'Registros de assiduidade de colaboradores',
      },
    ],
  }),
  component: ListAttendance,
})
