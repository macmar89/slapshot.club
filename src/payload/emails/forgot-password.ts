import { renderEmail } from './renderEmail'
import skTranslations from '../../../messages/sk.json'
import enTranslations from '../../../messages/en.json'

interface ForgotPasswordEmailData {
  token: string
  user: {
    username: string
    email: string
    preferredLanguage?: string
  }
}

export const renderForgotPasswordEmail = ({ token, user }: ForgotPasswordEmailData) => {
  const lang = user.preferredLanguage === 'en' ? 'en' : 'sk'
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/${lang}/reset-password?token=${token}`

  const translations = lang === 'en' ? enTranslations : skTranslations
  const emailT = (translations as any).Email.forgotPassword

  // Simple template helper to replace {username} in strings
  const t = (str: string, values: { [key: string]: string }) => {
    let result = str
    Object.entries(values).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value)
    })
    return result
  }

  const content = `
    <h1 class="title">${t(emailT.title, { username: user.username })}</h1>
    <p class="message">
      ${emailT.message}
    </p>
    <a href="${url}" class="button">${emailT.button}</a>
    <div class="footer">
      ${emailT.footer}
    </div>
  `

  return renderEmail(content)
}

export const getForgotPasswordSubject = (user: any) => {
  const lang = user.preferredLanguage === 'en' ? 'en' : 'sk'
  const translations = lang === 'en' ? enTranslations : skTranslations
  return (translations as any).Email.forgotPassword.subject
}
