import CryptoJS from 'crypto-js'
import Cookies from 'js-cookie'

const SECRET_KEY = process.env.NEXT_PUBLIC_AUTH_SECRET || 'default-secret-key'

export const encryptToken = (token: string): string => {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString()
}

export const decryptToken = (encryptedToken: string): string | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Error decrypting token:', error)
    return null
  }
}

export const setSecureTokenCookie = (token: string): void => {
  const encryptedToken = encryptToken(token)
  Cookies.set('auth_token', encryptedToken, {
    secure: true,
    sameSite: 'lax',
    expires: 7, // 7 days
    httpOnly: false // Need access from client side
  })
}

export const getTokenFromCookie = (): string | null => {
  const encryptedToken = Cookies.get('auth_token')
  if (!encryptedToken) return null
  return decryptToken(encryptedToken)
}

export const removeTokenCookie = (): void => {
  Cookies.remove('auth_token')
}