import { createFileRoute } from '@tanstack/react-router'
import { ListBiometricEvents } from '@/pages/biometrics/integrations'

export const Route = createFileRoute('/_private/biometrics/events')({
  component: ListBiometricEvents,
})
