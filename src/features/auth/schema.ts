import { z } from 'zod'

export const basePasswordSchema = z
  .string()
  .min(8, 'Heslo musí mať aspoň 8 znakov')
  .regex(/[A-Z]/, 'Heslo musí obsahovať aspoň jedno veľké písmeno')
  .regex(/[a-z]/, 'Heslo musí obsahovať aspoň jedno malé písmeno')
  .regex(/[0-9]/, 'Heslo musí obsahovať aspoň jednu číslicu')
  .regex(/[@$!%*?&#^()._+\-=\[\]{};:,.]/, 'Heslo musí obsahovať aspoň jeden špeciálny znak')

export const loginSchema = z.object({
  identifier: z.string().min(3, 'Zadajte email alebo užívateľské meno'),
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
  password: basePasswordSchema,
  turnstileToken: z.string().min(1, 'Potvrďte, že nie ste robot'),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'Musíte súhlasiť so spracovaním osobných údajov (GDPR)',
  }),
  marketingConsent: z.boolean(),
  referralCode: z.string().optional(),
  preferredLanguage: z.string().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Zadajte platný email'),
  turnstileToken: z.string().min(1, 'Potvrďte, že nie ste robot'),
})

export const resetPasswordSchema = z
  .object({
    password: basePasswordSchema,
    confirmPassword: z.string().min(1, 'Zopakujte nové heslo'),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Heslá sa nezhodujú',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export const usernameUpdateSchema = z.object({
  username: z
    .string()
    .min(4, 'Užívateľské meno musí mať aspoň 4 znaky')
    .max(20, 'Užívateľské meno môže mať maximálne 20 znakov')
    .regex(/^[a-zA-Z0-9_.]+$/, 'Povolené sú len písmená, čísla, bodka a podčiarkovník'),
})

export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, 'Zadajte aktuálne heslo'),
    newPassword: basePasswordSchema,
    confirmPassword: z.string().min(1, 'Zopakujte nové heslo'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Heslá sa nezhodujú',
    path: ['confirmPassword'],
  })

export const emailChangeRequestSchema = z.object({
  newEmail: z.string().email('Zadajte platný email'),
  message: z.string().min(10, 'Správa musí mať aspoň 10 znakov'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type UsernameUpdateFormData = z.infer<typeof usernameUpdateSchema>
export type PasswordUpdateFormData = z.infer<typeof passwordUpdateSchema>
export type EmailChangeRequestFormData = z.infer<typeof emailChangeRequestSchema>
