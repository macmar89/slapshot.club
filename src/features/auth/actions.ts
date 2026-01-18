import { LoginFormData } from '@/features/auth/schema'

export const loginUser = async (data: LoginFormData) => {
  const res = await fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return res
}

export const logoutUser = async () => {
  const res = await fetch('/api/users/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return res
}
