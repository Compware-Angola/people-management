import { ANGOLA_BI_REGEX, IBAN_REGEX } from '@/utils/regex'
import z from 'zod'

export const ibanSchema = z
  .string()
  .transform((value) => value.replace(/\s+/g, '').toUpperCase())
  .pipe(z.string().regex(IBAN_REGEX, 'Formato de IBAN inválido'))

export const biSchema = z
  .string()
  .regex(ANGOLA_BI_REGEX, 'Formato do BI inválido')

export const nifSchema = z.string().regex(/^\d{10}$/, 'NIF inválido')
