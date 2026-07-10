import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutationCreateEmployee } from '@/hooks/employees/use-mutation-create-employee'
import type { FormEvent, ReactNode } from 'react'
import type { CreateEmployeePayload } from '@/services/employees/create-employee.service'

export const Route = createFileRoute('/_private/employees/create')({
  component: CreateEmployeePage,
})

const initialForm: CreateEmployeePayload = {
  name: '',
  bi: '',
  nif: '',
  phone: '',
  alternativePhone: '',
  province: '',
  municipality: '',
  address: '',
  email: '',
  bank: '',
  iban: '',
  accountHolder: '',
  currency: 'AOA',
  status: 1,
}

function CreateEmployeePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<CreateEmployeePayload>(initialForm)
  const createEmployee = useMutationCreateEmployee()

  function updateField<TField extends keyof CreateEmployeePayload>(
    field: TField,
    value: CreateEmployeePayload[TField],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await createEmployee.mutateAsync({
      ...form,
      nif: form.nif || undefined,
      alternativePhone: form.alternativePhone || undefined,
    })

    await navigate({ to: '/employees' })
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Novo colaborador</h1>
          <p className="text-sm text-muted-foreground">
            Cadastro de colaborador.
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link to="/employees">Voltar</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Nome">
            <Input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              required
            />
          </FormField>

          <FormField label="BI">
            <Input
              value={form.bi}
              onChange={(event) => updateField('bi', event.target.value)}
              required
            />
          </FormField>

          <FormField label="NIF">
            <Input
              value={form.nif}
              onChange={(event) => updateField('nif', event.target.value)}
            />
          </FormField>

          <FormField label="Telefone">
            <Input
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              required
            />
          </FormField>

          <FormField label="Telefone alternativo">
            <Input
              value={form.alternativePhone}
              onChange={(event) =>
                updateField('alternativePhone', event.target.value)
              }
            />
          </FormField>

          <FormField label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              required
            />
          </FormField>

          <FormField label="Província">
            <Input
              value={form.province}
              onChange={(event) => updateField('province', event.target.value)}
              required
            />
          </FormField>

          <FormField label="Município">
            <Input
              value={form.municipality}
              onChange={(event) =>
                updateField('municipality', event.target.value)
              }
              required
            />
          </FormField>

          <FormField label="Banco">
            <Input
              value={form.bank}
              onChange={(event) => updateField('bank', event.target.value)}
              required
            />
          </FormField>

          <FormField label="IBAN">
            <Input
              value={form.iban}
              onChange={(event) => updateField('iban', event.target.value)}
              required
            />
          </FormField>

          <FormField label="Titular da conta">
            <Input
              value={form.accountHolder}
              onChange={(event) =>
                updateField('accountHolder', event.target.value)
              }
              required
            />
          </FormField>

          <FormField label="Moeda">
            <Input
              value={form.currency}
              onChange={(event) => updateField('currency', event.target.value)}
              required
            />
          </FormField>
        </div>

        <FormField label="Morada">
          <Input
            value={form.address}
            onChange={(event) => updateField('address', event.target.value)}
            required
          />
        </FormField>

        {createEmployee.isError && (
          <div className="rounded-lg border border-destructive/30 p-3 text-sm text-destructive">
            Não foi possível cadastrar o colaborador.
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={createEmployee.isPending}>
            {createEmployee.isPending ? 'A cadastrar...' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </div>
  )
}

type FormFieldProps = {
  label: string
  children: ReactNode
}

function FormField({ label, children }: FormFieldProps) {
  return (
    <label className="space-y-1.5 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  )
}
