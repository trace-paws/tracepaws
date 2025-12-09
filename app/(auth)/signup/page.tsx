'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

// W10 Wireframe Implementation - Organization signup form
export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organizationName: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null) // Clear error on input change
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required'
    if (!formData.lastName.trim()) return 'Last name is required'
    if (!formData.email.trim()) return 'Email is required'
    if (!formData.organizationName.trim()) return 'Organization name is required'
    if (formData.password.length < 8) return 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match'
    if (!agreedToTerms) return 'Please agree to the Terms of Service and Privacy Policy'
    return null
  }

  const generateOrgSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Step 1: Create Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            organization_name: formData.organizationName
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('User creation failed')

      // Step 2: Create organization record
      const orgSlug = generateOrgSlug(formData.organizationName)
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.organizationName,
          slug: orgSlug,
          email: formData.email,
          subscription_status: 'trialing',
          subscription_plan: 'starter',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days
        })
        .select('*')
        .single()

      if (orgError) throw orgError

      // Step 3: Create user profile (links to auth.users)
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,           // Same as auth.users(id)
          auth_id: authData.user.id,      // Reference to auth system
          organization_id: organization.id,
          email: formData.email.toLowerCase().trim(),
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: 'owner'                   // First user becomes owner
        })
        .select('*')
        .single()

      if (userError) throw userError

      console.log('Signup successful:', userProfile.email)

      // Redirect to dashboard
      router.push('/dashboard')

    } catch (error: any) {
      console.error('Signup error:', error)
      
      // Handle specific error cases
      if (error.message?.includes('duplicate key value')) {
        if (error.message.includes('email')) {
          setError('An account with this email already exists. Please sign in instead.')
        } else if (error.message.includes('slug')) {
          setError('An organization with this name already exists. Please choose a different name.')
        } else {
          setError('This information is already in use. Please try different details.')
        }
      } else if (error.message?.includes('invalid email')) {
        setError('Please enter a valid email address.')
      } else {
        setError(error.message || 'Account creation failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // W10 Wireframe Layout Implementation
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Header - W10 Wireframe */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-white">🐾</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-lg text-gray-600">Start your 14-day free trial</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSignup} className="space-y-6">
            
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <span className="text-red-500 text-xl mr-3">⚠️</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Name Fields - W10 Wireframe */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Mike"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className="w-full h-14 px-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Thompson"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  className="w-full h-14 px-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Organization Name - W10 Wireframe */}
            <div className="space-y-2">
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                Business Name *
              </label>
              <input
                id="organizationName"
                type="text"
                placeholder="Thompson Pet Cremation Services"
                value={formData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                required
                className="w-full h-14 px-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Email - W10 Wireframe */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                id="email"
                type="email"
                placeholder="mike@yourpetcrematorium.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="w-full h-14 px-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
              />
            </div>

            {/* Password - W10 Wireframe */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="w-full h-14 px-4 pr-12 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              <p className="text-xs text-gray-500">Min 8 characters, 1 uppercase, 1 number</p>
            </div>

            {/* Confirm Password - W10 Wireframe */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  className="w-full h-14 px-4 pr-12 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Terms Agreement - W10 Wireframe */}
            <div className="flex items-start space-x-3">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 leading-5">
                I agree to the{' '}
                <Link href="/terms" className="text-teal-600 hover:text-teal-500 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-teal-600 hover:text-teal-500 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Signup Button - W10 Wireframe */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-teal-600 text-white text-lg font-semibold rounded-xl hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link - W10 Wireframe */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Already have an account?</p>
            <Link 
              href="/login" 
              className="text-teal-600 hover:text-teal-500 font-semibold text-lg"
            >
              Log In →
            </Link>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 text-center">What you get:</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span>14-day free trial, no credit card required</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span>Photo documentation and family tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span>Complete chain of custody protection</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✓</span>
              <span>5-minute setup, works on any device</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}