'use client'

import { useMemo, useState } from 'react'
import { ChevronsUpDownIcon, XIcon } from 'lucide-react'

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
import {
    Field,
    FieldError,
    FieldLabel,
} from '@/components/ui/field'

import { cn } from '@/lib/utils'


type ComboboxOption = {
    label: string
    value: string
}


interface ComboboxFieldProps {
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
}: ComboboxFieldProps) {

    const field = useFieldContext<string>()

    const [open, setOpen] = useState(false)


    const isInvalid =
        field.state.meta.isTouched &&
        !field.state.meta.isValid


    const selectedItem = useMemo(
        () =>
            options.find(
                item => item.value === field.state.value
            ),
        [
            options,
            field.state.value
        ]
    )


    function handleSelect(value: string) {

        const isSame =
            value === field.state.value


        field.handleChange(
            isSame ? '' : value
        )

        setOpen(false)
    }


    function handleClear(
        e: React.MouseEvent
    ) {

        e.stopPropagation()

        field.handleChange('')
    }


    return (
        <Field data-invalid={isInvalid}>

            {
                label && (
                    <FieldLabel htmlFor={field.name}>
                        {label}
                    </FieldLabel>
                )
            }


            <Popover
                open={open}
                onOpenChange={setOpen}
            >

                <PopoverTrigger asChild>

                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-invalid={isInvalid}
                        onBlur={field.handleBlur}
                        className={cn(
                            'w-full justify-between font-normal',
                            !selectedItem &&
                            'text-muted-foreground',
                            isInvalid &&
                            'border-destructive'
                        )}
                    >

                        <span className="truncate">
                            {
                                selectedItem
                                    ? selectedItem.label
                                    : placeholder
                            }
                        </span>


                        <span className="flex items-center gap-1">

                            {
                                selectedItem && (
                                    <span
                                        role="button"
                                        onClick={handleClear}
                                        className="rounded p-0.5 opacity-50 hover:opacity-100"
                                    >
                                        <XIcon className="size-3.5" />
                                    </span>
                                )
                            }


                            <ChevronsUpDownIcon
                                className="size-4 opacity-50"
                            />

                        </span>

                    </Button>

                </PopoverTrigger>



                <PopoverContent
                    className="p-0"
                    style={{
                        width:
                            'var(--radix-popover-trigger-width)',
                    }}
                >

                    <Command>

                        <CommandInput
                            placeholder={placeholder}
                        />


                        <CommandList>

                            <CommandEmpty>
                                {emptyMessage}
                            </CommandEmpty>


                            <CommandGroup>

                                {
                                    options.map(option => (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onSelect={handleSelect}
                                        >

                                            {option.label}

                                        </CommandItem>
                                    ))
                                }

                            </CommandGroup>


                        </CommandList>


                    </Command>


                </PopoverContent>


            </Popover>



            {
                isInvalid && (
                    <FieldError
                        errors={
                            field.state.meta.errors
                        }
                    />
                )
            }


        </Field>
    )
}