'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  auth_id: string
  organization_id: string
  email: string
  first_name: string | null
  last_name: string | null
  full_name: string
  role: 'owner' | 'admin' | 'staff'
  avatar_url: string | null
  is_active: boolean
  last_seen_at?: string | null
}

interface Organization {
  id: string
  name: string
  slug: string
  subscription_plan: 'starter' | 'growth' | 'pro' | null
  subscription_status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  trial_ends_at?: string | null
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  organization: Organization | null
  loading: boolean
  error: string | null
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        loadProfile()
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        loadProfile()
      } else {
        setUser(null)
        setProfile(null)
        setOrganization(null)
        setError(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadProfile = async () => {
    try {
      setError(null)
      const response = await fetch('/api/auth/profile')

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        const message = body?.error || `Profile API error (${response.status})`

        // If unauthorized, clear auth state
        if (response.status === 401) {
          setUser(null)
          setProfile(null)
          setOrganization(null)
        }

        setError(message)
        setLoading(false)
        return
      }

      const result = await response.json()

      if (result.success) {
        setProfile(result.data.profile)
        setOrganization(result.data.organization)
      } else {
        setError(result.error || 'Failed to load profile')
      }

      setLoading(false)
    } catch (err) {
      console.error('Profile loading error:', err)
      setError(err instanceof Error ? err.message : 'Profile load failed')
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setOrganization(null)
    setError(null)
  }

  const refreshProfile = async () => {
    await loadProfile()
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      organization,
      loading,
      error,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function usePermissions() {
  const { profile } = useAuth()
  return {
    canViewBilling: profile?.role === 'owner',
    canManageTeam: ['owner', 'admin'].includes(profile?.role || ''),
    role: profile?.role || 'staff'
  }
}
