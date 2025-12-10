'use server'

import { redirect } from 'next/navigation'

export async function redirectToSignup() {
  redirect('/signup')
}