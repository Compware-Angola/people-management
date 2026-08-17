import { HTTPError } from 'ky'

type ApiErrorBody = {
  message?: string | string[]
  error?: string
  errors?: string[] | Record<string, string[]>
  statusCode?: number
}

function formatErrors(errors: ApiErrorBody['errors']) {
  if (Array.isArray(errors)) return errors.join(', ')

  if (errors && typeof errors === 'object') {
    return Object.values(errors).flat().join(', ')
  }

  return ''
}

function getMessageFromBody(body: ApiErrorBody) {
  if (Array.isArray(body.message)) return body.message.join(', ')
  if (body.message) return body.message

  const errors = formatErrors(body.errors)
  if (errors) return errors

  return body.error
}

function hasErrorData(error: unknown): error is { data: ApiErrorBody | string } {
  return typeof error === 'object' && error !== null && 'data' in error
}

function hasErrorResponse(error: unknown): error is { response: Response } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    error.response instanceof Response
  )
}

export async function getApiErrorMessage(error: unknown): Promise<string> {
  if (hasErrorData(error)) {
    if (typeof error.data === 'string') {
      return error.data || 'Ocorreu um erro inesperado. Tente novamente.'
    }

    const message = getMessageFromBody(error.data)

    return message || 'Ocorreu um erro inesperado. Tente novamente.'
  }

  if (error instanceof HTTPError || hasErrorResponse(error)) {
    try {
      const responseText = await error.response.clone().text()
      const body = JSON.parse(responseText) as ApiErrorBody
      const message = getMessageFromBody(body)

      return message || 'Ocorreu um erro inesperado. Tente novamente.'
    } catch {
      return 'Ocorreu um erro inesperado. Tente novamente.'
    }
  }
  return 'Ocorreu um erro inesperado. Tente novamente.'
}
