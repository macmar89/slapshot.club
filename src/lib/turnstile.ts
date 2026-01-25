export async function verifyTurnstileToken(token: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    throw new Error('TURNSTILE_SECRET_KEY is not defined')
  }

  const formData = new FormData()
  formData.append('secret', secretKey)
  formData.append('response', token)

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })

    const outcome = await res.json()
    return outcome.success
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}
