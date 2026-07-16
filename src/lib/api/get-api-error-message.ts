import  { HTTPError } from 'ky'

type ApiErrorBody ={
  message: string | string[]
  error: string
  statusCode: number
}


export async function getApiErrorMessage(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const body = await error.data

      return Array.isArray(body.message) ? body.message.join(', ') : body.message
    } catch(error) {
        console.log(error)
      return 'Ocorreu um erro inesperado. Tente novamente.'
    }
  }
  return 'Ocorreu um erro inesperado. Tente novamente.'
}