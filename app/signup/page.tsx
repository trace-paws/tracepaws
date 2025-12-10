import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignupForm } from './signup-form'

export default async function SignupPage() {
  const supabase = createClient()
  
  // Check if user is already logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f766e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        fontFamily: '"Google Sans", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        margin: 0,
        width: '100%'
      }}
    >
      {/* Geometric background elements - matches login page */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          transform: 'rotate(45deg)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '50%'
        }}
      />
      
      <SignupForm />
    </div>
  )
}