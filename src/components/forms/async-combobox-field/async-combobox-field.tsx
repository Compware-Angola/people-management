'use client'
import { useMemo, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { ChevronsUpDownIcon, XIcon } from 'lucide-react'

import { useFieldContext } from '..'
import { Spinner } from '@/components/ui/spinner'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'

type BaseItem = {
    label: string
    value: string
}

type QueryResult<T> = {
    data?: T[]
    isLoading: boolean
}

interface AsyncComboboxFieldProps<T extends BaseItem> {
    label?: string
    placeholder?: string
    emptyMessage?: string
    debounce?: number
    modal?: boolean
    useQuery: (search: string) => QueryResult<T>
}

export function AsyncComboboxField<T extends BaseItem>(
    props: AsyncComboboxFieldProps<T>,
) {
    const {
        label,
        placeholder = 'Pesquisar...',
        emptyMessage = 'Nenhum resultado encontrado.',
        debounce = 500,

        useQuery,
    } = props

    const field = useFieldContext<string>()
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

    const [open, setOpen] = useState(false)
    const [search, setSearch] = useDebounceValue('', debounce)

    const { data = [], isLoading } = useQuery(search)

    const items = useMemo(() => data, [data])

    const selectedItem = useMemo(
        () => items.find((item) => item.value === field.state.value),
        [items, field.state.value],
    )

    const handleSelect = (currentValue: string) => {
        const isSame = currentValue === field.state.value
        field.handleChange(isSame ? '' : currentValue)
        setOpen(false)
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        field.handleChange('')
    }

    return (
        <Field data-invalid={isInvalid}>
            {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-invalid={isInvalid}
                        onBlur={field.handleBlur}
                        className={cn(
                            'w-full justify-between font-normal',
                            !selectedItem && 'text-muted-foreground',
                            isInvalid && 'border-destructive',
                        )}
                    >
                        <span className="truncate">
                            {selectedItem ? selectedItem.label : placeholder}
                        </span>

                        <span className="ml-2 flex shrink-0 items-center gap-1">
                            {selectedItem && (
                                <span
                                    role="button"
                                    onClick={handleClear}
                                    className="rounded p-0.5 opacity-50 hover:opacity-100"
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
                    style={{ width: 'var(--radix-popover-trigger-width)' }}
                >
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={placeholder}
                            onValueChange={(value) => setSearch(value)}
                            className="h-9"
                        />
                        <CommandList>
                            {isLoading && (
                                <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                                    <Spinner data-icon="inline-start" /> Carregando...
                                </div>
                            )}

                            {!isLoading && <CommandEmpty>{emptyMessage}</CommandEmpty>}

                            {!isLoading && items.length > 0 && (
                                <CommandGroup>
                                    {items.map((item) => (
                                        <CommandItem
                                            className={cn(
                                                field.state.value === item.value && 'bg-primary',
                                            )}
                                            key={item.value}
                                            value={item.value}
                                            onSelect={handleSelect}
                                        >
                                            {item.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </Field>
    )
}
