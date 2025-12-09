'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('=== LOGIN ATTEMPT ===')
  console.log('Email:', email)

  if (!email || !password) {
    redirect('/login?error=Please%20enter%20email%20and%20password')
  }

  // Authenticate with Supabase - DON'T catch redirect errors
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password: password
  })

  console.log('Auth response:', { user: !!data.user, error: error?.message })

  if (error) {
    console.error('Login error details:', error)
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (!data.user) {
    console.error('No user returned from login')
    redirect('/login?error=Login%20failed%20-%20no%20user%20returned')
  }

  console.log('Login successful for:', data.user.email)

  // Success - refresh and redirect (this should not be in try/catch)
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('=== SIGNUP ATTEMPT ===')
  console.log('Email:', email)

  if (!email || !password) {
    redirect('/login?error=Please%20enter%20email%20and%20password')
  }

  // Create account with Supabase - DON'T catch redirect errors
  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase().trim(),
    password: password
  })

  console.log('Signup response:', { user: !!data.user, error: error?.message })

  if (error) {
    console.error('Signup error details:', error)
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  console.log('Signup successful for:', data.user?.email)

  // Success message - DON'T catch redirect errors
  revalidatePath('/', 'layout')
  redirect('/login?message=Account%20created!%20Check%20email%20to%20verify%20if%20required')
}