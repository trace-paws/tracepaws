'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('=== LOGIN ATTEMPT ===')
    console.log('Email:', email)
    console.log('Password length:', password?.length)

    if (!email || !password) {
      console.log('Missing email or password')
      redirect('/login?error=Please%20enter%20email%20and%20password')
    }

    // Check if user exists first
    const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers()
    console.log('Existing users check:', existingUsers?.users?.map(u => u.email))

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: password
    })

    console.log('Auth response:', { data: !!data.user, error: error?.message })

    if (error) {
      console.error('Login error details:', error)
      redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    if (!data.user) {
      console.error('No user returned from login')
      redirect('/login?error=Login%20failed%20-%20no%20user%20returned')
    }

    console.log('Login successful for:', data.user.email)

    // Success - refresh and redirect
    revalidatePath('/', 'layout')
    redirect('/dashboard')

  } catch (error) {
    console.error('Login exception details:', error)
    // More specific error message
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred'
    redirect(`/login?error=${encodeURIComponent('Login failed: ' + errorMsg)}`)
  }
}

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('=== SIGNUP ATTEMPT ===')
    console.log('Email:', email)
    console.log('Password length:', password?.length)

    if (!email || !password) {
      redirect('/login?error=Please%20enter%20email%20and%20password')
    }

    // Create account with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password: password
    })

    console.log('Signup response:', { data: !!data.user, error: error?.message })

    if (error) {
      console.error('Signup error details:', error)
      redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    console.log('Signup successful for:', data.user?.email)

    // Success message
    revalidatePath('/', 'layout')
    redirect('/login?message=Account%20created!%20Check%20email%20to%20verify%20if%20required')

  } catch (error) {
    console.error('Signup exception details:', error)
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred'
    redirect(`/login?error=${encodeURIComponent('Signup failed: ' + errorMsg)}`)
  }
}