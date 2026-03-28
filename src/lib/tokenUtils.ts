import type { User } from '../features/auth/types/AuthTypes'

interface TokenPayload {
  sub: string
  email: string
  exp: number
}

function decodeToken(token: string): TokenPayload {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  )
  return JSON.parse(json) as TokenPayload
}

export function decodeUser(token: string): User {
  const payload = decodeToken(token)
  return { id: payload.sub, email: payload.email }
}
