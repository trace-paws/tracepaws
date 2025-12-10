import { createBrowserClient } from '@supabase/ssr'

// Browser Supabase client configured per auth spec (PKCE, persisted session, namespaced storage)
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase browser env vars')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storageKey: 'tracepaws-auth',
      debug: process.env.NODE_ENV === 'development',
    },
    global: {
      headers: {
        'x-application-name': 'TracePaws',
        'x-client-type': 'staff-dashboard',
      },
    },
  })
}
