type SearchParamValue = string | number | boolean | null | undefined

export function buildSearchParams(params?: Record<string, SearchParamValue>) {
  const searchParams = new URLSearchParams()

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    searchParams.set(key, String(value))
  })

  return searchParams
}
