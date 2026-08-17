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
  useCreatePositionMutation,
  useUpdatePositionMutation,
} from '@/hooks/positions'
import type {
  CreatePositionDTO,
  Position,
} from '@/services/positions/positions.types'
import {
  usePositionFormModal,
  type PositionFormValues,
} from '../hooks/use-position-form-modal'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  position?: Position | null
}

const statusOptions = [
  { label: 'Ativo', value: '1' },
  { label: 'Inativo', value: '0' },
]

function buildPayload(values: PositionFormValues): CreatePositionDTO {
  return {
    description: values.description,
    status: Number(values.status) as CreatePositionDTO['status'],
  }
}

export function PositionFormModal({ open, onOpenChange, position }: Props) {
  const isEdit = Boolean(position)
  const { mutateAsync: createPosition } = useCreatePositionMutation()
  const { mutateAsync: updatePosition } = useUpdatePositionMutation()

  const { form, canSubmit, isLoading } = usePositionFormModal({
    open,
    position,
    onSave: async (values) => {
      const payload = buildPayload(values)

      if (position) {
        await updatePosition({
          code: position.code,
          data: payload,
        })
      } else {
        await createPosition(payload)
      }

      onOpenChange(false)
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
          <DialogTitle>{isEdit ? 'Editar Cargo' : 'Novo Cargo'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Atualize a descrição e o estado do cargo.'
              : 'Cadastre um novo cargo para ser usado nos fluxos de pessoas.'}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.AppField name="description">
            {(field) => (
              <field.TextField
                label="Descrição"
                placeholder="Ex: Analista de Recursos Humanos"
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
