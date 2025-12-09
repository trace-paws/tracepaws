'use client'

import { useAuth } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface DashboardStats {
  organization_name: string | null
  pets_received: number | null
  pets_in_progress: number | null
  pets_ready: number | null
  pets_today: number | null
  subscription_plan: string | null
  subscription_status: string | null
}

export default function DashboardPage() {
  const { user, profile, organization, loading } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Load dashboard stats from live database
  useEffect(() => {
    const loadStats = async () => {
      if (!organization?.id) return

      try {
        const { data, error } = await supabase
          .from('dashboard_stats')
          .select('*')
          .eq('organization_id', organization.id)
          .single()

        if (error) throw error
        setStats(data)
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    loadStats()
  }, [organization])

  // Show loading while authenticating
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">🐾</span>
          </div>
          <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TracePaws...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (redirecting)
  if (!user || !profile || !organization) {
    return null
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getGreetingEmoji = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '☀️'
    if (hour < 17) return '🌤️'
    return '🌙'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Greeting */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {getGreeting()}, {profile.first_name || 'there'}! {getGreetingEmoji()}
              </h1>
              <p className="text-sm text-gray-600">
                {organization.name}
              </p>
            </div>

            {/* Right: User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
              </div>
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                {profile.first_name?.[0] || profile.email[0].toUpperCase()}
              </div>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        
        {/* Organization Status Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Organization Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🏢</span>
                <h3 className="text-lg font-semibold text-blue-800">Organization</h3>
              </div>
              <p className="text-blue-700">
                {organization.name}
                <br />
                <span className="text-sm text-blue-600">
                  {organization.subscription_plan} plan • {organization.subscription_status}
                </span>
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">👤</span>
                <h3 className="text-lg font-semibold text-green-800">Your Role</h3>
              </div>
              <p className="text-green-700">
                {profile.full_name}
                <br />
                <span className="text-sm text-green-600 capitalize">
                  {profile.role} access
                </span>
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🎯</span>
                <h3 className="text-lg font-semibold text-purple-800">Status</h3>
              </div>
              <p className="text-purple-700">
                Authentication working!
                <br />
                <span className="text-sm text-purple-600">
                  Connected to live database
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Stats (Live Data) */}
        {loadingStats ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard stats...</p>
            </div>
          </div>
        ) : stats ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Dashboard Stats</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.pets_received || 0}
                </div>
                <p className="text-sm text-blue-700">Awaiting</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats.pets_in_progress || 0}
                </div>
                <p className="text-sm text-orange-700">In Progress</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.pets_ready || 0}
                </div>
                <p className="text-sm text-green-700">Ready</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stats.pets_today || 0}
                </div>
                <p className="text-sm text-purple-700">Today</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to TracePaws!</h2>
            <p className="text-gray-600">
              Your dashboard will show live stats once you start documenting pets.
            </p>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">🎉 Authentication System Working!</h3>
          <p className="text-lg mb-6">
            You're successfully logged in and connected to the live database
          </p>
          <div className="space-y-2 text-teal-100">
            <p>✅ Login/signup working with real user data</p>
            <p>✅ Organization context loaded: {organization.name}</p>
            <p>✅ Role-based access: {profile.role} permissions</p>
            <p>✅ Live stats from dashboard_stats view</p>
          </div>
          <p className="mt-6 text-lg">
            Ready for pet management system development!
          </p>
        </div>
      </div>
    </div>
  )
}