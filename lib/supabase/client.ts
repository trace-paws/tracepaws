import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

// Browser client for client-side operations (staff dashboard)
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Type exports for the application
export type Tables = Database['public']['Tables']
export type Pet = Tables['pets']['Row']
export type Organization = Tables['organizations']['Row'] 
export type UserProfile = Tables['users']['Row']
export type Checkpoint = Tables['checkpoints']['Row']
export type Photo = Tables['photos']['Row']
export type Notification = Tables['notifications']['Row']