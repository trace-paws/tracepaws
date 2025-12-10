'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorBoundary } from '@/components/error-boundary'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      })

      if (authError) throw authError
      if (!data.user) throw new Error('Login failed')

      // Success - redirect to dashboard
      router.push('/dashboard')

    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <div 
        className="min-h-screen flex items-center justify-center p-5"
        style={{
          background: '#0f766e',
          fontFamily: "'Google Sans', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}
      >
        {/* Geometric background elements matching signup */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-[10%] left-[10%] w-25 h-25 bg-white/5 transform rotate-45"
            style={{ borderRadius: '20px' }}
          />
          <div 
            className="absolute bottom-[15%] right-[15%] w-20 h-20 bg-white/3 rounded-full"
          />
        </div>

        <Card 
          className="w-full max-w-[460px] relative z-10"
          style={{
            borderRadius: '24px',
            boxShadow: '0 32px 80px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            padding: '48px'
          }}
        >
          <CardHeader className="text-center p-0 mb-8">
            <div 
              className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-white text-xl"
              style={{
                background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(15, 118, 110, 0.3)'
              }}
            >
              🐾
            </div>
            
            <div 
              className="text-[22px] font-medium mb-2"
              style={{ color: '#0f766e', letterSpacing: '-0.25px' }}
            >
              TracePaws
            </div>
            
            <CardDescription className="text-base text-[#5f6368]">
              Chain of Custody Made Simple
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-[18px] h-[18px] rounded border-gray-300"
                    style={{ accentColor: '#0f766e' }}
                  />
                  <label htmlFor="remember" className="text-sm text-[#5f6368] cursor-pointer">
                    Remember me
                  </label>
                </div>
                
                <button
                  type="button"
                  className="text-[#0f766e] text-sm font-medium hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                size="full"
                disabled={loading}
                className="text-base font-medium"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Log In'
                )}
              </Button>
            </form>

            <div className="text-center mt-6 text-sm text-[#5f6368]">
              Don't have an account?{' '}
              <button
                onClick={() => router.push('/signup')}
                className="text-[#0f766e] font-medium hover:underline"
              >
                Sign Up →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  )
}