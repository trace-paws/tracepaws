import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signIn, signUp } from './actions'

export default async function LoginPage() {
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
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        margin: 0,
        width: '100%'
      }}
    >
      {/* Geometric background elements */}
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
      
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          padding: '48px',
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Logo section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #0f766e 0%, #0d665c 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '28px',
              color: 'white',
              boxShadow: '0 8px 24px rgba(15, 118, 110, 0.4)'
            }}
          >
            🐾
          </div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '8px',
              letterSpacing: '-0.02em',
              margin: '0 0 8px 0'
            }}
          >
            TracePaws
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: '#64748b',
              fontWeight: 500,
              margin: 0
            }}
          >
            Staff Portal
          </p>
        </div>

        {/* Login Form */}
        <form
          action={signIn}
          method="post"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <label
              style={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: '14px',
                display: 'block'
              }}
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              style={{
                height: '52px',
                padding: '0 16px',
                border: '2px solid #f1f5f9',
                borderRadius: '12px',
                fontSize: '16px',
                background: '#fafafa',
                width: '100%',
                boxSizing: 'border-box'
              }}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <label
              style={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: '14px',
                display: 'block'
              }}
              htmlFor="password"
            >
              Password
            </label>
            <input
              style={{
                height: '52px',
                padding: '0 16px',
                border: '2px solid #f1f5f9',
                borderRadius: '12px',
                fontSize: '16px',
                background: '#fafafa',
                width: '100%',
                boxSizing: 'border-box'
              }}
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            style={{
              height: '52px',
              background: '#0f766e',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 118, 110, 0.3)',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            Sign In
          </button>
        </form>

        {/* Create Account Button - Now redirects to /signup */}
        <form
          action={signUp}
          method="post"
          style={{ marginTop: '16px' }}
        >
          <button
            type="submit"
            style={{
              height: '48px',
              background: 'transparent',
              color: '#64748b',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
              marginTop: '8px',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            Create Account
          </button>
        </form>

        {/* Forgot password link */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a
            href="#forgot"
            style={{
              color: '#0f766e',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  )
}