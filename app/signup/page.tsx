'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorBoundary } from '@/components/error-boundary'

interface SignupFormData {
  firstName: string
  lastName: string
  businessName: string
  email: string
  password: string
  confirmPassword: string
}

interface ValidationErrors {
  firstName?: string
  lastName?: string
  businessName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Real-time validation matching prototype
  const validateField = (name: keyof SignupFormData, value: string): string | undefined => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          return `${name === 'firstName' ? 'First' : 'Last'} name is required`
        }
        break
      
      case 'businessName':
        if (!value.trim()) {
          return 'Business name is required'
        }
        break
      
      case 'email':
        if (!value.trim()) {
          return 'Email is required'
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Valid email is required'
        }
        break
      
      case 'password':
        if (!value) {
          return 'Password is required'
        }
        if (value.length < 8) {
          return 'Use 8 or more characters'
        }
        break
      
      case 'confirmPassword':
        if (!value) {
          return 'Please confirm your password'
        }
        if (value !== formData.password) {
          return "Passwords don't match"
        }
        break
    }
    return undefined
  }

  const handleInputChange = (name: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error if field becomes valid
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (name: keyof SignupFormData) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, formData[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: ValidationErrors = {}
    let hasErrors = false
    
    Object.keys(formData).forEach(key => {
      const fieldName = key as keyof SignupFormData
      const error = validateField(fieldName, formData[fieldName])
      if (error) {
        newErrors[fieldName] = error
        hasErrors = true
      }
    })
    
    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      businessName: true,
      email: true,
      password: true,
      confirmPassword: true
    })
    
    setErrors(newErrors)
    
    if (hasErrors) return

    // Submit signup using our API foundation
    try {
      setLoading(true)
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          organizationName: formData.businessName,
          email: formData.email,
          password: formData.password
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Signup failed')
      }

      // Success - redirect to dashboard or verification page
      console.log('Signup successful:', result)
      router.push('/dashboard?welcome=true')

    } catch (error) {
      console.error('Signup error:', error)
      setErrors({ email: error instanceof Error ? error.message : 'Signup failed' })
    } finally {
      setLoading(false)
    }
  }

  // Matching the exact prototype design
  return (
    <ErrorBoundary>
      <div 
        className="min-h-screen flex items-center justify-center p-5"
        style={{
          background: '#0f766e', // Exact teal from prototype
          fontFamily: "'Google Sans', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}
      >
        {/* Geometric background elements from prototype */}
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
            {/* Logo section matching prototype */}
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
            
            <CardTitle className="text-2xl font-normal text-[#202124] mb-2">
              Create your TracePaws Account
            </CardTitle>
            
            <CardDescription className="text-base text-[#5f6368]">
              to protect your crematorium's reputation
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields - matching prototype two-column layout */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    label="First name"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                    error={errors.firstName}
                    touched={touched.firstName}
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Last name"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    onBlur={() => handleBlur('lastName')}
                    error={errors.lastName}
                    touched={touched.lastName}
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {/* Business Name - full width */}
              <Input
                label="Crematorium name"
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                onBlur={() => handleBlur('businessName')}
                error={errors.businessName}
                touched={touched.businessName}
                placeholder="Thompson Pet Cremation Services"
                required
                autoComplete="organization"
              />

              {/* Email - full width */}
              <Input
                label="Business email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={errors.email}
                touched={touched.email}
                placeholder="mike@thompsonpets.com"
                required
                autoComplete="email"
              />

              {/* Password Fields - matching prototype two-column layout */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    error={errors.password}
                    touched={touched.password}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Confirm"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Show Password Checkbox - matching prototype */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-[18px] h-[18px] rounded border-gray-300"
                  style={{ accentColor: '#0f766e' }}
                />
                <label htmlFor="showPassword" className="text-sm text-[#5f6368] cursor-pointer select-none">
                  Show password
                </label>
              </div>

              {/* Form Actions - matching prototype */}
              <div className="flex items-center justify-between pt-6">
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-[#0f766e] text-sm font-medium px-4 py-2 rounded hover:bg-[#0f766e]/5 transition-colors"
                >
                  Sign in instead
                </button>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="min-w-[80px]"
                  style={{
                    background: loading ? '#f1f3f4' : '#0f766e',
                    color: loading ? '#5f6368' : 'white'
                  }}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Next'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  )
}