import { ListBiometricEquipments } from '@/pages/biometrics/equipments'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/biometrics/equipments')({
  component: ListBiometricEquipments,
})

