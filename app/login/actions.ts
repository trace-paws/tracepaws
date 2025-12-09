'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Simple form data extraction
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Authenticate with Supabase
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error.message)
    redirect('/login?error=Invalid%20credentials')
  }

  // Success - refresh the page and redirect
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}