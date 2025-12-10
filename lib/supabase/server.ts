import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server client (anon) for SSR/API routes that should respect RLS
export async function createClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase server env vars')
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
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
          // Server Component - can be ignored with middleware
        }
      },
    },
    global: {
      headers: {
        'x-application-name': 'TracePaws-Server',
        'x-client-type': 'server-ssr',
      },
    },
  })
}

// Admin client (service role) for trusted server operations (profile lookup, billing, etc.)
export async function createAdminClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase service role env vars')
  }

  return createServerClient(supabaseUrl, serviceRoleKey, {
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
          // Server Component - can be ignored
        }
      },
    },
    global: {
      headers: {
        'x-application-name': 'TracePaws-Server',
        'x-client-type': 'service-role',
      },
    },
  })
}
