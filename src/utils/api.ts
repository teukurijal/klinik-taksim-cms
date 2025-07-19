import { getTokenFromCookie } from './auth'

interface ApiRequestInit extends RequestInit {
  headers?: HeadersInit
}

const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

export const api = async (url: string, options: ApiRequestInit = {}): Promise<Response> => {
  const token = getTokenFromCookie()
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    
    if (response.status === 401) {
      redirectToLogin()
      throw new Error('Unauthorized - redirecting to login')
    }
    
    return response
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('Network error:', error)
    }
    throw error
  }
}

// Convenience methods
export const apiGet = (url: string, options?: Omit<ApiRequestInit, 'method'>) =>
  api(url, { ...options, method: 'GET' })

export const apiPost = (url: string, data?: unknown, options?: Omit<ApiRequestInit, 'method' | 'body'>) =>
  api(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })

export const apiPut = (url: string, data?: unknown, options?: Omit<ApiRequestInit, 'method' | 'body'>) =>
  api(url, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })

export const apiPatch = (url: string, data?: unknown, options?: Omit<ApiRequestInit, 'method' | 'body'>) =>
  api(url, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })

export const apiDelete = (url: string, options?: Omit<ApiRequestInit, 'method'>) =>
  api(url, { ...options, method: 'DELETE' })

// For file uploads (multipart/form-data)
export const apiUpload = (url: string, formData: FormData, options?: Omit<ApiRequestInit, 'method' | 'body'>) => {
  const token = getTokenFromCookie()
  
  return api(url, {
    ...options,
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
    body: formData,
  })
}