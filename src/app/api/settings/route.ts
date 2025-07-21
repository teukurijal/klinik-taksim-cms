import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Container } from '../../../shared/di/Container'

const container = Container.getInstance()
const settingsController = container.getClinicSettingsController()

async function authenticate(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  } catch {
    return false
  }
}

export async function GET() {
  // Settings are publicly readable - no auth check required for GET
  return settingsController.getCurrent()
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await authenticate()
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return settingsController.create(request)
}

export async function PUT(request: NextRequest) {
  const isAuthenticated = await authenticate()
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // For settings, we'll use a fixed ID approach or get the current settings ID
  // The controller will handle finding the settings record
  return settingsController.updateCurrent(request)
}