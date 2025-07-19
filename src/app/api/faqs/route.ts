import { NextRequest, NextResponse } from 'next/server'
import { Container } from '../../../shared/di/Container'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const container = Container.getInstance()
    const controller = container.getFAQController()
    
    return await controller.getAll()
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const container = Container.getInstance()
    const controller = container.getFAQController()
    
    return await controller.create(request)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}