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
}

interface Organization {
  id: string
  name: string
  slug: string
  subscription_plan: 'starter' | 'growth' | 'pro' | null
  subscription_status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  organization: Organization | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        loadProfile()
      } else {
        setUser(null)
        setProfile(null)
        setOrganization(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async () => {
    try {
      // Use our API endpoint instead of direct database query
      const response = await fetch('/api/auth/profile')
      
      if (!response.ok) {
        console.error('Profile API error:', response.status)
        setLoading(false)
        return
      }

      const result = await response.json()
      
      if (result.success) {
        setProfile(result.data.profile)
        setOrganization(result.data.organization)
      } else {
        console.error('Profile fetch failed:', result.error)
      }
      
      setLoading(false)

    } catch (error) {
      console.error('Profile loading error:', error)
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
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