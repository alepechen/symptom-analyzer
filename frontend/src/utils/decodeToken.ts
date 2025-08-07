import { jwtDecode } from 'jwt-decode'

interface TokenPayload {
  sub: string // usually email or username
  id: string
  name: string
  exp: number
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwtDecode<TokenPayload>(token)
    return decoded
  } catch (error) {
    console.error('Invalid token', error)
    return null
  }
}
