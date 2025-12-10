'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

// Types based on live database schema (yplmrwismtztyomrvzvj)
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
  last_seen_at: string | null
  created_at: string
  updated_at: string
}

interface Organization {
  id: string
  name: string
  slug: string
  subscription_plan: 'starter' | 'growth' | 'pro' | null
  subscription_status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
  trial_ends_at: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
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

  // Load user profile with organization context
  const loadUserProfile = async (userId: string) => {
    try {
      setLoading(true)

      // Single query to get user + organization (efficient)
      const { data: userWithOrg, error } = await supabase
        .from('users')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('auth_id', userId)
        .single()

      if (error) {
        console.error('Error loading user profile:', error)
        return
      }

      if (userWithOrg) {
        setProfile(userWithOrg)
        setOrganization(userWithOrg.organization as Organization)
        
        // Update last seen timestamp
        await supabase
          .from('users')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', userWithOrg.id)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initialize authentication state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        loadUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        
        setUser(session?.user ?? null)

        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setProfile(null)
          setOrganization(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setOrganization(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    organization,
    loading,
    signOut,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use authentication context
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// Permission checking hooks based on live database roles
export function usePermissions() {
  const { profile } = useAuth()
  
  return {
    canViewBilling: profile?.role === 'owner',
    canManageTeam: ['owner', 'admin'].includes(profile?.role || ''),
    canDeletePets: ['owner', 'admin'].includes(profile?.role || ''),
    canInviteUsers: ['owner', 'admin'].includes(profile?.role || ''),
    canViewReports: ['owner', 'admin'].includes(profile?.role || ''),
    role: profile?.role || 'staff'
  }
}