'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const router = useRouter()
  
  // Create Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Validation functions
  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case 'firstName':
      case 'lastName':
        return !value.trim() ? `${fieldName === 'firstName' ? 'First' : 'Last'} name is required` : ''
      
      case 'businessName':
        return !value.trim() ? 'Business name is required' : ''
      
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Valid email is required'
        return ''
      
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 8) return 'Use 8 or more characters'
        return ''
      
      case 'confirmPassword':
        if (!value) return 'Please confirm your password'
        if (value !== formData.password) return "Passwords don't match"
        return ''
      
      default:
        return ''
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleInputBlur = (field: string) => {
    const error = validateField(field, formData[field as keyof typeof formData])
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData])
      if (error) newErrors[field] = error
    })
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      // Create user account with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            business_name: formData.businessName.trim()
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create account')

      // Create organization record using service role
      const slug = formData.businessName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      // Call our API endpoint to create organization and user profile
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: authData.user.id,
          email: formData.email.toLowerCase().trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          businessName: formData.businessName.trim(),
          slug: slug
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create organization')
      }

      // Success - redirect to dashboard (or email verification if needed)
      router.push('/dashboard')

    } catch (error: any) {
      console.error('Signup error:', error)
      setErrors({ general: error.message || 'Failed to create account. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 32px 80px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        padding: '48px',
        width: '100%',
        maxWidth: '460px',
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* Logo section - matching your design prototype exactly */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '20px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(15, 118, 110, 0.3)'
          }}
        >
          🐾
        </div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 500,
            color: '#0f766e',
            marginBottom: '8px',
            letterSpacing: '-0.25px'
          }}
        >
          TracePaws
        </div>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 400,
            color: '#202124',
            marginBottom: '8px',
            margin: 0
          }}
        >
          Create your TracePaws Account
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#5f6368',
            margin: 0
          }}
        >
          to protect your crematorium's reputation
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '32px' }}>
        {/* General error message */}
        {errors.general && (
          <div
            style={{
              fontSize: '14px',
              color: '#d93025',
              marginBottom: '24px',
              padding: '12px',
              background: '#fef2f2',
              borderRadius: '8px',
              border: '1px solid #fecaca'
            }}
          >
            {errors.general}
          </div>
        )}

        {/* Name fields row */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '16px', 
            marginBottom: '24px' 
          }}
          className="form-row"
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                color: '#5f6368',
                marginBottom: '8px',
                fontWeight: 400
              }}
              htmlFor="firstName"
            >
              First name
            </label>
            <input
              style={{
                width: '100%',
                height: '56px',
                padding: '0 16px',
                border: `1px solid ${errors.firstName ? '#d93025' : '#dadce0'}`,
                borderRadius: '4px',
                fontSize: '16px',
                color: '#202124',
                background: '#fff',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onBlur={() => handleInputBlur('firstName')}
              autoComplete="given-name"
              required
            />
            {errors.firstName && (
              <div style={{ fontSize: '12px', color: '#d93025', marginTop: '8px' }}>
                {errors.firstName}
              </div>
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                color: '#5f6368',
                marginBottom: '8px',
                fontWeight: 400
              }}
              htmlFor="lastName"
            >
              Last name
            </label>
            <input
              style={{
                width: '100%',
                height: '56px',
                padding: '0 16px',
                border: `1px solid ${errors.lastName ? '#d93025' : '#dadce0'}`,
                borderRadius: '4px',
                fontSize: '16px',
                color: '#202124',
                background: '#fff',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onBlur={() => handleInputBlur('lastName')}
              autoComplete="family-name"
              required
            />
            {errors.lastName && (
              <div style={{ fontSize: '12px', color: '#d93025', marginTop: '8px' }}>
                {errors.lastName}
              </div>
            )}
          </div>
        </div>

        {/* Business name */}
        <div style={{ width: '100%', marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              color: '#5f6368',
              marginBottom: '8px',
              fontWeight: 400
            }}
            htmlFor="businessName"
          >
            Crematorium name
          </label>
          <input
            style={{
              width: '100%',
              height: '56px',
              padding: '0 16px',
              border: `1px solid ${errors.businessName ? '#d93025' : '#dadce0'}`,
              borderRadius: '4px',
              fontSize: '16px',
              color: '#202124',
              background: '#fff',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
            type="text"
            id="businessName"
            name="businessName"
            placeholder="Thompson Pet Cremation Services"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            onBlur={() => handleInputBlur('businessName')}
            autoComplete="organization"
            required
          />
          {errors.businessName && (
            <div style={{ fontSize: '12px', color: '#d93025', marginTop: '8px' }}>
              {errors.businessName}
            </div>
          )}
        </div>

        {/* Email */}
        <div style={{ width: '100%', marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              color: '#5f6368',
              marginBottom: '8px',
              fontWeight: 400
            }}
            htmlFor="email"
          >
            Business email
          </label>
          <input
            style={{
              width: '100%',
              height: '56px',
              padding: '0 16px',
              border: `1px solid ${errors.email ? '#d93025' : '#dadce0'}`,
              borderRadius: '4px',
              fontSize: '16px',
              color: '#202124',
              background: '#fff',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
            type="email"
            id="email"
            name="email"
            placeholder="mike@thompsonpets.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onBlur={() => handleInputBlur('email')}
            autoComplete="email"
            required
          />
          {errors.email && (
            <div style={{ fontSize: '12px', color: '#d93025', marginTop: '8px' }}>
              {errors.email}
            </div>
          )}
        </div>

        {/* Password fields row */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '16px', 
            marginBottom: '24px' 
          }}
          className="form-row"
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                color: '#5f6368',
                marginBottom: '8px',
                fontWeight: 400
              }}
              htmlFor="password"
            >
              Password
            </label>
            <input
              style={{
                width: '100%',
                height: '56px',
                padding: '0 16px',
                border: `1px solid ${errors.password ? '#d93025' : '#dadce0'}`,
                borderRadius: '4px',
                fontSize: '16px',
                color: '#202124',
                background: '#fff',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleInputBlur('password')}
              autoComplete="new-password"
              required
            />
            {errors.password && (
              <div style={{ fontSize: '12px', color: '#d93025', marginTop: '8px' }}>
                {errors.password}
              </div>
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                color: '#5f6368',
                marginBottom: '8px',
                fontWeight: 400
              }}
              htmlFor="confirmPassword"
            >
              Confirm
            </label>
            <input
              style={{
                width: '100%',
                height: '56px',
                padding: '0 16px',
                border: `1px solid ${errors.confirmPassword ? '#d93025' : '#dadce0'}`,
                borderRadius: '4px',
                fontSize: '16px',
                color: '#202124',
                background: '#fff',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              onBlur={() => handleInputBlur('confirmPassword')}
              autoComplete="new-password"
              required
            />
            {errors.confirmPassword && (
              <div style={{ fontSize: '12px', color: '#d93025', marginTop: '8px' }}>
                {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>

        {/* Show password checkbox */}
        <div style={{ margin: '24px 0' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
            className="checkbox-wrapper"
          >
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                margin: 0,
                cursor: 'pointer',
                accentColor: '#0f766e'
              }}
              className="checkbox"
            />
            <span
              style={{
                fontSize: '14px',
                color: '#5f6368',
                cursor: 'pointer',
                userSelect: 'none'
              }}
              className="checkbox-label"
            >
              Show password
            </span>
          </label>
        </div>

        {/* Form actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '32px'
          }}
          className="form-actions"
        >
          <a
            href="/login"
            style={{
              color: '#0f766e',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              padding: '9px 16px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease'
            }}
            className="sign-in-link"
          >
            Sign in instead
          </a>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#f1f3f4' : '#0f766e',
              color: loading ? '#5f6368' : 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '80px',
              position: 'relative'
            }}
            className="next-button"
          >
            {loading ? (
              <>
                <span style={{ color: 'transparent' }}>Next</span>
                <div
                  style={{
                    position: 'absolute',
                    width: '16px',
                    height: '16px',
                    top: '50%',
                    left: '50%',
                    marginTop: '-8px',
                    marginLeft: '-8px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}
                />
              </>
            ) : (
              'Next'
            )}
          </button>
        </div>
      </form>

      {/* Mobile responsive styles */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 480px) {
          .form-row {
            flex-direction: column !important;
            gap: 24px !important;
          }
          
          .form-actions {
            flex-direction: column-reverse !important;
            gap: 16px !important;
            align-items: stretch !important;
          }
          
          .next-button {
            width: 100% !important;
            padding: 12px !important;
          }
          
          .sign-in-link {
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  )
}