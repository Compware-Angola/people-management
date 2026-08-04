import { useState } from 'react'
import { Activity, Fingerprint, Plus, RefreshCcw } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { BiometricEquipment } from '@/services/biometrics/biometrics.types'
import { BiometricEquipmentFormModal } from './components/biometric-equipment-form-modal'
import { BiometricIntegrationFormModal } from './components/biometric-integration-form-modal'
import { EquipmentsTable } from './components/equipments-table'
import { IntegrationsTable } from './components/integrations-table'
import { queryClient } from '@/lib/query-client'
import { QUERY_KEY } from '@/constants/query-key'

type ActiveTab = 'equipments' | 'integrations'

export function ListBiometrics() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('equipments')
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false)
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false)
  const [editingEquipment, setEditingEquipment] =
    useState<BiometricEquipment | null>(null)

  function openCreateEquipmentModal() {
    setEditingEquipment(null)
    setIsEquipmentModalOpen(true)
  }

  function openEditEquipmentModal(equipment: BiometricEquipment) {
    setEditingEquipment(equipment)
    setIsEquipmentModalOpen(true)
  }

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.biometrics] })
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Biometria</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">Biometria</h1>
          <p className="text-muted-foreground">
            Gerir equipamentos e consultar eventos biométricos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>

          {activeTab === 'equipments' ? (
            <Button onClick={openCreateEquipmentModal}>
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Equipamento
            </Button>
          ) : (
            <Button onClick={() => setIsIntegrationModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Registrar Evento
            </Button>
          )}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ActiveTab)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-xl grid-cols-2">
          <TabsTrigger value="equipments">
            <Fingerprint className="h-4 w-4" />
            Equipamentos
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Activity className="h-4 w-4" />
            Eventos Biométricos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipments" className="mt-6">
          <EquipmentsTable onEdit={openEditEquipmentModal} />
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <IntegrationsTable />
        </TabsContent>
      </Tabs>

      <BiometricEquipmentFormModal
        open={isEquipmentModalOpen}
        onOpenChange={setIsEquipmentModalOpen}
        equipment={editingEquipment}
      />

      <BiometricIntegrationFormModal
        open={isIntegrationModalOpen}
        onOpenChange={setIsIntegrationModalOpen}
      />
    </div>
  )
}
