'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError, Session } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import { setSecureTokenCookie, getTokenFromCookie, removeTokenCookie } from '@/utils/auth'

interface SignInResponse {
  user: User | null
  session: Session | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: SignInResponse; error: AuthError | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ data: { user: null, session: null }, error: null }),
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // If no session but we have a token in cookie, try to restore session
      if (!session) {
        const tokenFromCookie = getTokenFromCookie()
        if (tokenFromCookie) {
          // Try to get user info with the stored token
          const { data: { user } } = await supabase.auth.getUser(tokenFromCookie)
          if (user) {
            setUser(user)
          } else {
            // Token is invalid, remove it
            removeTokenCookie()
          }
        }
      } else {
        setUser(session.user)
        // Update cookie with fresh token
        if (session.access_token) {
          setSecureTokenCookie(session.access_token)
        }
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (session?.access_token) {
          setSecureTokenCookie(session.access_token)
        } else {
          removeTokenCookie()
        }
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    // Store encrypted token in secure cookie on successful login
    if (data.session?.access_token && !error) {
      setSecureTokenCookie(data.session.access_token)
    }
    
    return { data, error }
  }

  const signOut = async () => {
    removeTokenCookie()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}