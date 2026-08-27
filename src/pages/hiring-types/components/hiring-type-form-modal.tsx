import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Save, X } from 'lucide-react'
import {
  useCreateHiringTypeMutation,
  useUpdateHiringTypeMutation,
} from '@/hooks/hiring-types'
import type {
  CreateHiringTypeDTO,
  HiringType,
} from '@/services/hiring-types/hiring-types.types'
import {
  useHiringTypeFormModal,
  type HiringTypeFormValues,
} from '../hooks/use-hiring-type-form-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  hiringType?: HiringType | null
}

const statusOptions = [
  { label: 'Ativo', value: '1' },
  { label: 'Inativo', value: '0' },
]

function buildPayload(values: HiringTypeFormValues): CreateHiringTypeDTO {
  return {
    acronym: values.acronym,
    description: values.description,
    status: Number(values.status) as CreateHiringTypeDTO['status'],
  }
}

export function HiringTypeFormModal({
  open,
  onOpenChange,
  hiringType,
}: Props) {
  const isEdit = Boolean(hiringType)
  const { mutateAsync: createHiringType } = useCreateHiringTypeMutation()
  const { mutateAsync: updateHiringType } = useUpdateHiringTypeMutation()

  const { form, canSubmit, isLoading } = useHiringTypeFormModal({
    open,
    hiringType,
    onSave: async (values) => {
      const payload = buildPayload(values)

      try {
        if (hiringType) {
          await updateHiringType({
            code: hiringType.code,
            data: payload,
          })
        } else {
          await createHiringType(payload)
        }

        onOpenChange(false)
      } catch {
        // A mutation ja apresenta a mensagem devolvida pela API.
      }
    },
  })

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset()
    }

    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? 'Editar Tipo de Contratação'
              : 'Novo Tipo de Contratação'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize a sigla, a descrição e o estado do tipo de contratação.'
              : 'Cadastre um tipo de contratação para ser usado nas requisições de vaga.'}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.AppField name="acronym">
            {(field) => (
              <field.TextField label="Sigla" placeholder="Ex: CTI" />
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => (
              <field.TextField
                label="Descrição"
                placeholder="Ex: Contrato por tempo indeterminado"
              />
            )}
          </form.AppField>

          <form.AppField name="status">
            {(field) => (
              <field.SelectField label="Estado" options={statusOptions} />
            )}
          </form.AppField>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>

            <Button type="submit" disabled={!canSubmit || isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
              {isEdit ? 'Guardar alterações' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
