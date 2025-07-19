// Server-side auth utilities for middleware (Edge Runtime compatible)

export const decryptTokenServer = async (encryptedToken: string): Promise<string | null> => {
  try {
    // Simple base64 decode for now (you might want to implement proper AES decryption later)
    // This is a simplified version for middleware compatibility
    const decoded = atob(encryptedToken)
    
    // Basic validation - check if it looks like a JWT token
    if (decoded.includes('.') && decoded.split('.').length === 3) {
      return decoded
    }
    
    return null
  } catch (error) {
    console.error('Error decrypting token in middleware:', error)
    return null
  }
}

export const isValidTokenFormat = (token: string): boolean => {
  if (!token || token.length < 10) return false
  
  try {
    // Check if it's encrypted (our encrypted tokens are longer)
    if (token.length > 100) return true
    
    // Check if it's a JWT format
    const parts = token.split('.')
    return parts.length === 3
  } catch {
    return false
  }
}