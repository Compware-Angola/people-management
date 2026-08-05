import { useEffect, useRef, useState } from 'react'
import { Loader2, Paperclip, Plus, Save, Trash2, X } from 'lucide-react'
import { BANKS, CURRENCY } from '@/constants'
import {
  useAddEmployeeFileMutation,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from '@/hooks/employees'
import { useUploadSingle } from '@/hooks/upload/use-upload-single'
import type {
  Employee,
  EmployeeFileType,
} from '@/services/employees/employees.types'
import type { User } from '@/services/users/users.types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const FILE_TYPES: EmployeeFileType[] = [
  'BI',
  'NIF',
  'CONTRATO',
  'CURRICULO',
  'CERTIFICADO',
  'DIPLOMA',
  'DECLARACAO',
  'FOTO',
  'OUTRO',
]

type PendingDocument = {
  id: string
  file: File
  type: EmployeeFileType
  description: string
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  employee?: Employee | null
}

export function EmployeeBankModal({
  open,
  onOpenChange,
  user,
  employee,
}: Props) {
  const { mutateAsync: createEmployee, isPending: isCreating } =
    useCreateEmployeeMutation()
  const { mutateAsync: updateEmployee, isPending: isUpdating } =
    useUpdateEmployeeMutation()
  const { mutateAsync: addFile, isPending: isAddingFile } =
    useAddEmployeeFileMutation()
  const uploadMutation = useUploadSingle()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [bank, setBank] = useState('')
  const [iban, setIban] = useState('')
  const [accountHolder, setAccountHolder] = useState('')
  const [currency, setCurrency] = useState('AOA')
  const [documentType, setDocumentType] = useState<EmployeeFileType>('BI')
  const [documentDescription, setDocumentDescription] = useState('')
  const [selectedDocumentFile, setSelectedDocumentFile] = useState<File | null>(
    null,
  )
  const [pendingDocuments, setPendingDocuments] = useState<PendingDocument[]>(
    [],
  )
  const isEdit = Boolean(employee)
  const isPending = isCreating || isUpdating || uploadMutation.isPending || isAddingFile

  useEffect(() => {
    if (open) {
      setBank(employee?.bank ?? '')
      setIban(employee?.iban ?? '')
      setAccountHolder(employee?.accountHolder ?? user?.name ?? '')
      setCurrency(employee?.currency ?? 'AOA')
      setDocumentType('BI')
      setDocumentDescription('')
      setSelectedDocumentFile(null)
      setPendingDocuments([])

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [employee, open, user])

  const canSubmit = Boolean(
    (user || employee) && bank && iban && accountHolder && currency,
  )

  function handleDocumentFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setSelectedDocumentFile(event.target.files?.[0] ?? null)
  }

  function addPendingDocument() {
    if (!selectedDocumentFile) return

    setPendingDocuments((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        file: selectedDocumentFile,
        type: documentType,
        description: documentDescription,
      },
    ])

    setDocumentType('BI')
    setDocumentDescription('')
    setSelectedDocumentFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function removePendingDocument(id: string) {
    setPendingDocuments((current) =>
      current.filter((document) => document.id !== id),
    )
  }

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit) return

    if (employee) {
      await updateEmployee({
        id: employee.id.toString(),
        data: {
          bank,
          iban,
          accountHolder,
          currency,
          status: employee.status,
        },
      })
    } else if (user) {
      await createEmployee({
        userId: user.id,
        bank,
        iban,
        accountHolder,
        currency,
        status: user.status,
      })

      for (const document of pendingDocuments) {
        const uploadResponse = await uploadMutation.mutateAsync({
          file: document.file,
          options: { folder: `colaboradores/${user.id}` },
        })

        await addFile({
          userId: user.id,
          type: document.type,
          path: uploadResponse.key,
          originalName: document.file.name,
          description: document.description || undefined,
        })
      }
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl!">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar colaborador' : 'Cadastrar colaborador'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize os dados bancários do colaborador.'
              : 'Informe os dados bancários para vincular o utilizador como colaborador.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="rounded-lg border bg-muted/30 p-3 text-sm">
            <p className="font-medium">
              {employee?.name ?? user?.name ?? 'Utilizador'}
            </p>
            <p className="text-muted-foreground">
              {employee?.email ?? user?.email}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Banco</Label>
              <Select value={bank} onValueChange={setBank}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar banco" />
                </SelectTrigger>
                <SelectContent>
                  {BANKS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Moeda</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar moeda" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee-iban">IBAN</Label>
              <Input
                id="employee-iban"
                value={iban}
                onChange={(event) => setIban(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee-account-holder">
                Titular da conta
              </Label>
              <Input
                id="employee-account-holder"
                value={accountHolder}
                onChange={(event) => setAccountHolder(event.target.value)}
              />
            </div>
          </div>

          {!isEdit && (
            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <h3 className="text-sm font-semibold">Documentos</h3>
                <p className="text-sm text-muted-foreground">
                  Anexe documentos que devem ficar associados ao colaborador.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={documentType}
                    onValueChange={(value) =>
                      setDocumentType(value as EmployeeFileType)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {FILE_TYPES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employee-create-file">Ficheiro</Label>
                  <Input
                    ref={fileInputRef}
                    id="employee-create-file"
                    type="file"
                    onChange={handleDocumentFileChange}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="employee-create-file-description">
                    Descrição
                  </Label>
                  <Input
                    id="employee-create-file-description"
                    value={documentDescription}
                    onChange={(event) =>
                      setDocumentDescription(event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPendingDocument}
                  disabled={!selectedDocumentFile || isPending}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Anexar documento
                </Button>
              </div>

              {pendingDocuments.length > 0 && (
                <div className="grid gap-2 md:grid-cols-2">
                  {pendingDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-start justify-between gap-3 rounded-lg border bg-muted/30 p-3 text-sm"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          <p className="truncate font-medium">
                            {document.type} - {document.file.name}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {(document.file.size / 1024).toFixed(2)} KB
                        </p>
                        {document.description && (
                          <p className="truncate text-muted-foreground">
                            {document.description}
                          </p>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePendingDocument(document.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" disabled={!canSubmit || isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : <Save />}
              {isEdit ? 'Guardar alterações' : 'Cadastrar colaborador'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
