'use client'

import React from 'react'
import { useAuth } from './auth-provider'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: ('owner' | 'admin' | 'staff')[]
  fallback?: React.ReactNode
  requireActiveSubscription?: boolean
}

export function ProtectedRoute({ 
  children, 
  requiredRole = ['owner', 'admin', 'staff'],
  fallback,
  requireActiveSubscription = false
}: ProtectedRouteProps) {
  const { user, profile, organization, loading, error } = useAuth()
  const router = useRouter()

  // Loading state - IMPORTANT: Don't redirect while loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#0f766e] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  // Surface profile load errors gracefully
  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold">Authentication Required</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-[#0f766e] text-white px-4 py-2 rounded-lg hover:bg-[#0d665c]"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  // Not authenticated - redirect to login
  if (!user) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    router.push('/login')
    return null
  }

  // User authenticated but no profile - this might happen during signup
  if (!profile) {
    console.log('User found but no profile, waiting...')
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#0f766e] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600">Setting up your account...</p>
        </div>
      </div>
    )
  }

  // Account deactivated
  if (!profile.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-xl font-bold">Account Deactivated</h2>
          <p className="text-gray-600">
            Your account has been deactivated. Please contact your organization owner.
          </p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-[#0f766e] text-white px-4 py-2 rounded-lg hover:bg-[#0d665c]"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  // Role checking
  if (!requiredRole.includes(profile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to access this page.
            Required role: {requiredRole.join(' or ')}
          </p>
          <p className="text-sm text-gray-500">
            Your role: {profile.role}
          </p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-[#0f766e] text-white px-4 py-2 rounded-lg hover:bg-[#0d665c]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Subscription requirement check
  if (requireActiveSubscription && organization?.subscription_status !== 'active') {
    const isTrialing = organization?.subscription_status === 'trialing'
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">💳</span>
          </div>
          <h2 className="text-xl font-bold">
            {isTrialing ? 'Subscription Required' : 'Billing Issue'}
          </h2>
          <p className="text-gray-600">
            {isTrialing 
              ? 'This feature requires an active subscription. Your trial ends soon.' 
              : 'Please update your billing information to continue.'}
          </p>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={() => router.push('/dashboard')}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Dashboard
            </button>
            <button 
              onClick={() => router.push('/settings/billing')}
              className="bg-[#0f766e] text-white px-4 py-2 rounded-lg hover:bg-[#0d665c]"
            >
              View Billing
            </button>
          </div>
        </div>
      </div>
    )
  }

  // User is authenticated and authorized
  return <>{children}</>
}

// Permission gate component for conditional rendering
export function PermissionGate({ 
  requiredRole, 
  children, 
  fallback = null 
}: {
  requiredRole: ('owner' | 'admin' | 'staff')[]
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { profile } = useAuth()
  
  if (!profile || !requiredRole.includes(profile.role)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}
