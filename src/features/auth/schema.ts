import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Zadajte platný email'),
  password: z.string().min(1, 'Zadajte heslo'),
  turnstileToken: z.string().min(1, 'Potvrďte, že nie ste robot'),
})

export const registerSchema = z.object({
  username: z
    .string()
    .min(4, 'Užívateľské meno musí mať aspoň 4 znaky')
    .max(20, 'Užívateľské meno môže mať maximálne 20 znakov')
    .regex(/^[a-zA-Z0-9_.]+$/, 'Povolené sú len písmená, čísla, bodka a podčiarkovník'),
  email: z.string().email('Zadajte platný email'),
  password: z
    .string()
    .min(8, 'Heslo musí mať aspoň 8 znakov')
    .regex(/[A-Z]/, 'Heslo musí obsahovať aspoň jedno veľké písmeno')
    .regex(/[a-z]/, 'Heslo musí obsahovať aspoň jedno malé písmeno')
    .regex(/[0-9]/, 'Heslo musí obsahovať aspoň jednu číslicu')
    .regex(/[@$!%*?&#^()]/, 'Heslo musí obsahovať aspoň jeden špeciálny znak'),
  turnstileToken: z.string().min(1, 'Potvrďte, že nie ste robot'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Zadajte platný email'),
  turnstileToken: z.string().min(1, 'Potvrďte, že nie ste robot'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
