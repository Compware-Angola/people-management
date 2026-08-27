import { Plus, RefreshCcw } from 'lucide-react'
import { useState } from 'react'

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

import { IntegrationsTable } from '../components/integrations-table'
import { BiometricIntegrationFormModal } from '../components/biometric-integration-form-modal'

export function ListBiometricEvents() {
    const [open, setOpen] = useState(false)
    const { can } = useAuth()
    const canWriteBiometrics = can(PermissionsEnum.WRITE_BIOMETRICS)

    function handleRefresh() {
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.biometrics],
        })
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
                                <BreadcrumbPage>Eventos Biométricos</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-3xl font-bold">
                        Eventos Biométricos
                    </h1>
                    <p className="text-muted-foreground">
                        Consulte e registre eventos biométricos.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleRefresh}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Atualizar
                    </Button>
                    {canWriteBiometrics && (
                        <Button onClick={() => setOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Registrar Evento
                        </Button>
                    )}
                </div>
            </div>
            <IntegrationsTable />
            <BiometricIntegrationFormModal
                open={open}
                onOpenChange={setOpen}
            />
        </div>
    )
}
