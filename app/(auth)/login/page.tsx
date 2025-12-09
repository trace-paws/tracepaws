'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

// W9 Wireframe Implementation - Mobile-optimized login form
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Sign in with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      })

      if (authError) throw authError
      if (!data.user) throw new Error('Login failed')

      // Simplified query without complex joins to avoid TypeScript issues
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', data.user.id)
        .single()

      if (profileError) throw new Error('User profile not found')
      if (!userProfile) throw new Error('User profile not found')
      
      // Now TypeScript knows the exact type from the users table
      if (!userProfile.is_active) {
        throw new Error('Account deactivated')
      }

      console.log('Login successful:', userProfile.email)
      
      // Redirect to dashboard (AuthProvider will load organization context)
      router.push('/dashboard')

    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // W9 Wireframe Layout Implementation
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo Section - W9 Wireframe */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-white">🐾</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TracePaws</h1>
          <p className="text-lg text-gray-600">Chain of Custody Made Simple</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <span className="text-red-500 text-xl mr-3">⚠️</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Email Field - W9 Wireframe */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 px-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
              />
            </div>

            {/* Password Field - W9 Wireframe */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-14 px-4 pr-12 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password - W9 Wireframe */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link 
                href="/forgot-password" 
                className="text-sm text-teal-600 hover:text-teal-500 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button - W9 Wireframe */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-teal-600 text-white text-lg font-semibold rounded-xl hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Signup Link - W9 Wireframe */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Don't have an account?</p>
            <Link 
              href="/signup" 
              className="text-teal-600 hover:text-teal-500 font-semibold text-lg"
            >
              Sign Up →
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Secure login</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>No credit card</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>5 min setup</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}