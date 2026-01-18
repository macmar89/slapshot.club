import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Zadajte platný email'),
  password: z.string().min(1, 'Zadajte heslo'),
})

export type LoginFormData = z.infer<typeof loginSchema>
