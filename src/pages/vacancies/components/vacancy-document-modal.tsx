import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Paperclip, X } from 'lucide-react'
import { toast } from 'sonner'
import { useUploadVacancyDocumentMutation } from '@/hooks/vacancies'
import { useDeleteFile, useUploadSingle } from '@/hooks/upload/use-upload-single'
import { getApiErrorMessage } from '@/lib/api/get-api-error-message'
import type {
  Vacancy,
  VacancyDocumentType,
} from '@/services/vacancies/vacancies.types'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vacancy?: Vacancy | null
}

export function VacancyDocumentModal({ open, onOpenChange, vacancy }: Props) {
  const [type, setType] = useState<VacancyDocumentType>('EDITAL')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const { mutateAsync: uploadDocument, isPending: isRegistering } =
    useUploadVacancyDocumentMutation()
  const { mutateAsync: uploadSingle, isPending: isUploading } =
    useUploadSingle()
  const { mutateAsync: deleteFile } = useDeleteFile()
  const isPending = isUploading || isRegistering

  useEffect(() => {
    if (!open) return

    setType('EDITAL')
    setDescription('')
    setFile(null)
  }, [open])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!vacancy || !file) return

    let key: string
    try {
      const uploaded = await uploadSingle({
        file,
        options: { folder: 'vacancies' },
      })
      key = uploaded.key
    } catch (error) {
      toast.error(await getApiErrorMessage(error))
      return
    }

    try {
      await uploadDocument({
        code: vacancy.vacancyCode,
        data: {
          key,
          originalName: file.name,
          type,
          ...(description ? { description } : {}),
        },
      })
    } catch {
      await deleteFile(key).catch(() => {})
      return
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl!">
        <DialogHeader>
          <DialogTitle>Anexar Documento</DialogTitle>
          <DialogDescription>
            {vacancy
              ? `${vacancy.vacancyCode} - ${vacancy.position?.description ?? '-'}`
              : 'Nenhuma vaga selecionada.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de documento</label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as VacancyDocumentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EDITAL">Edital</SelectItem>
                <SelectItem value="OUTRO">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <Input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ex: Edital de contratação"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ficheiro</label>
            <Input
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>

            <Button type="submit" disabled={!file || !vacancy || isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : <Paperclip />}
              Anexar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
