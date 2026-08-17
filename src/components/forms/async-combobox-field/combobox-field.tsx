import { useMemo, useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react'
import { useFieldContext } from '..'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { cn } from '@/lib/utils'

type ComboboxOption = {
  label: string
  value: string
}

interface ComboboxFieldProps {
  disabled?: boolean
  label?: string
  placeholder?: string
  emptyMessage?: string
  options: ComboboxOption[]
}

export function ComboboxField({
  label,
  placeholder = 'Selecionar...',
  emptyMessage = 'Nenhum resultado encontrado.',
  options,
  disabled,
}: ComboboxFieldProps) {
  const field = useFieldContext<string>()
  const [open, setOpen] = useState(false)

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  const selectedItem = useMemo(
    () => options.find((item) => item.value === field.state.value),
    [options, field.state.value],
  )

  function handleSelect(value: string) {
    const isSame = value === field.state.value
    field.handleChange(isSame ? '' : value)
    setOpen(false)
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    if (disabled) return
    field.handleChange('')
  }

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Popover
        open={open && !disabled}
        onOpenChange={(nextOpen) => {
          if (disabled) return
          setOpen(nextOpen)
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={isInvalid}
            onBlur={field.handleBlur}
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal disabled:cursor-not-allowed',
              !selectedItem && 'text-muted-foreground',
              isInvalid && 'border-destructive',
            )}
          >
            <span className="truncate">
              {selectedItem ? selectedItem.label : placeholder}
            </span>
            <span className="flex items-center gap-1">
              {selectedItem && !disabled && (
                <span
                  role="button"
                  onClick={handleClear}
                  className="rounded p-0.5 opacity-50 hover:opacity-100 data-[state=open]:bg-muted"
                >
                  <XIcon className="size-3.5" />
                </span>
              )}
              <ChevronsUpDownIcon className="size-4 opacity-50" />
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          style={{
            width: 'var(--radix-popover-trigger-width)',
          }}
        >
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = option.value === field.state.value
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelect(option.value)}
                      className={cn(
                        'cursor-pointer',
                        isSelected && 'font-medium',
                      )}
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 size-4 shrink-0',
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <span className="truncate">{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
