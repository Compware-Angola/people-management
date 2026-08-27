import { FileText, Loader2, Trash2, X } from 'lucide-react'

import {
  useEmployeeQuery,
  useRemoveEmployeeFileMutation,
} from '@/hooks/employees'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeId?: number | null
}

export function EmployeeDetailsModal({
  open,
  onOpenChange,
  employeeId,
}: Props) {
  const { data: employee, isLoading } = useEmployeeQuery(
    open && employeeId ? employeeId.toString() : undefined,
  )

  const { mutateAsync: removeFile, isPending: isRemovingFile } =
    useRemoveEmployeeFileMutation()

  const files = employee?.files ?? []

  async function handleRemoveFile(id: number) {
    await removeFile(id.toString())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-4xl sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detalhes do colaborador</DialogTitle>
          <DialogDescription>
            Consulte as informações pessoais e os documentos do colaborador.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">
                Informação pessoal
              </TabsTrigger>

              <TabsTrigger value="documents">
                Documentos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-4">
              <div className="grid gap-4 rounded-lg border p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">
                      {employee?.name ?? '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">
                      {employee?.email ?? '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">BI</p>
                    <p className="font-medium">
                      {employee?.bi ?? '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">NIF</p>
                    <p className="font-medium">
                      {employee?.nif ?? '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Banco</p>
                    <p className="font-medium">
                      {employee?.bank ?? '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">IBAN</p>
                    <p className="font-medium">
                      {employee?.iban ?? '-'}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <div className="space-y-3 rounded-lg border p-4">
                {files.length === 0 ? (
                  <div className="flex h-32 flex-col items-center justify-center rounded-lg border text-sm text-muted-foreground">
                    <FileText className="mb-2 h-6 w-6" />
                    <span>Nenhum documento registado.</span>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg border p-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="wrap-break-word font-medium">
                            {file.type} - {file.originalName}
                          </p>

                          <p className="break-all text-muted-foreground">
                            {file.path}
                          </p>

                          {file.description && (
                            <p className="mt-1 wrap-break-word text-muted-foreground">
                              {file.description}
                            </p>
                          )}
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFile(file.id)}
                          disabled={isRemovingFile}
                          title="Remover documento"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            <X className="mr-2 h-4 w-4" />
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}