import { HTTPError } from 'ky'

type ApiErrorBody = {
  message: string | string[]
  error: string
  statusCode: number
}

export async function getApiErrorMessage(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const body = (await error.response.json()) as ApiErrorBody

      return Array.isArray(body.message) ? body.message.join(', ') : body.message
    } catch {
      return 'Ocorreu um erro inesperado. Tente novamente.'
    }
  }
  return 'Ocorreu um erro inesperado. Tente novamente.'
}
