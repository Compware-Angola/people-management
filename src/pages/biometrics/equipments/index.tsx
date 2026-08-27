import { useState } from 'react'
import { Plus, RefreshCcw } from 'lucide-react'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'

import { queryClient } from '@/lib/query-client'
import { QUERY_KEY } from '@/constants/query-key'
import { useAuth } from '@/hooks/auth'
import { PermissionsEnum } from '@/enums/permissions.enum'

import type { BiometricEquipment } from '@/services/biometrics/biometrics.types'

import { EquipmentsTable } from '../components/equipments-table'
import { BiometricEquipmentFormModal } from '../components/biometric-equipment-form-modal'

export function ListBiometricEquipments() {
    const [open, setOpen] = useState(false)
    const [editingEquipment, setEditingEquipment] =
        useState<BiometricEquipment | null>(null)
    const { can } = useAuth()
    const canWriteBiometrics = can(PermissionsEnum.WRITE_BIOMETRICS)

    function handleRefresh() {
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.biometrics],
        })
    }

    function handleCreate() {
        setEditingEquipment(null)
        setOpen(true)
    }

    function handleEdit(equipment: BiometricEquipment) {
        setEditingEquipment(equipment)
        setOpen(true)
    }

    return (
        <div className="flex-1 space-y-6 p-8">
            <div className="flex justify-between items-center">
                <div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />

                            <BreadcrumbItem>
                                <BreadcrumbPage>Equipamentos Biométricos</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-3xl font-bold">
                        Equipamentos Biométricos
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie os equipamentos cadastrados.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleRefresh}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Atualizar
                    </Button>

                    {canWriteBiometrics && (
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Cadastrar Equipamento
                        </Button>
                    )}
                </div>
            </div>
            <EquipmentsTable
                onEdit={handleEdit}
                canEdit={canWriteBiometrics}
            />
            <BiometricEquipmentFormModal
                open={open}
                onOpenChange={setOpen}
                equipment={editingEquipment}
            />
        </div>
    )
}
