type FormatDatePtAoOptions = {
  withTime?: boolean
}

export function formatDatePtAO(
  value?: string | Date | null,
  options?: FormatDatePtAoOptions,
) {
  if (!value) return '-'

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(options?.withTime
      ? {
          hour: '2-digit',
          minute: '2-digit',
        }
      : {}),
  }).format(date)
}
