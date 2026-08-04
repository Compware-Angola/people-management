import { ListBiometrics } from '@/pages/biometrics/list-biometrics'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/biometrics/')({
  head: () => ({
    meta: [
      { title: 'Biometria' },
      {
        name: 'description',
        content: 'Equipamentos e eventos biométricos',
      },
    ],
  }),
  component: ListBiometrics,
})
