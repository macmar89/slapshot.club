import { useTranslations } from 'next-intl'

export default function NotFoundPage() {
  const t = useTranslations('HomePage') // Using HomePage just for example, usually 'NotFound' namespace
  return (
    <div className="flex h-screen items-center justify-center text-white">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
    </div>
  )
}
