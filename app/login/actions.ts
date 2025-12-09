'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('Login attempt for:', email)

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email?.toLowerCase()?.trim() || '',
      password: password || ''
    })

    if (error) {
      console.error('Login error:', error.message)
      redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    if (!data.user) {
      console.error('No user returned from login')
      redirect('/login?error=Login%20failed')
    }

    console.log('Login successful for:', data.user.email)

    // Success - refresh and redirect
    revalidatePath('/', 'layout')
    redirect('/dashboard')

  } catch (error) {
    console.error('Login exception:', error)
    redirect('/login?error=Something%20went%20wrong')
  }
}

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('Signup attempt for:', email)

    // Create account with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email?.toLowerCase()?.trim() || '',
      password: password || ''
    })

    if (error) {
      console.error('Signup error:', error.message)
      redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    console.log('Signup successful for:', data.user?.email)

    // Success message
    revalidatePath('/', 'layout')
    redirect('/login?message=Check%20your%20email%20to%20verify%20your%20account')

  } catch (error) {
    console.error('Signup exception:', error)
    redirect('/login?error=Account%20creation%20failed')
  }
}